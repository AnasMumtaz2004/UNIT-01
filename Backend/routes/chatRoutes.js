const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const { protect } = require("../middleware/authMiddleware");

// Gemini API 
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

//Send message, get AI reply, save to db

router.post("/", protect, async (req, res) => {
  const { message, chatId } = req.body;

  try {
    let chat;

    if (chatId) {
      // load existing chat
      chat = await Chat.findById(chatId);

      // make sure this chat belongs to logged in user
      if (!chat || chat.userId.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: "Chat not found" });
      }
    } else {

      chat = new Chat({
        userId: req.user._id,
        title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
        messages: [],
      });
    }


    chat.messages.push({ role: "user", content: message });

    const geminiMessages = chat.messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const geminiRes = await fetch(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: geminiMessages,
        }),
      }
    );

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      console.log("Gemini error:", geminiData);
      return res.status(500).json({ message: "AI service error" });
    }
    const aiReply = geminiData.candidates[0].content.parts[0].text;


    chat.messages.push({ role: "assistant", content: aiReply });

    await chat.save();

    res.json({
      chatId: chat._id,
      reply: aiReply,
      title: chat.title,
    });
  } catch (error) {
    console.log("Chat route error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
}); // ✅ FIX: this was accidentally commented out before



//Get all chats for sidebar

router.get("/", protect, async (req, res) => {
  try {
    // only fetch title and timestamps, skip messages array (saves bandwidth)
    const chats = await Chat.find({ userId: req.user._id })
      .select("title createdAt updatedAt")
      .sort({ updatedAt: -1 }); // newest first

    res.json(chats);
  } catch (error) {
    console.log("Get chats error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // make sure user owns this chat
    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(chat);
  } catch (error) {
    console.log("Get chat error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


//Delete a chat

router.delete("/:id", protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await chat.deleteOne();
    res.json({ message: "Chat deleted" });
  } catch (error) {
    console.log("Delete chat error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;