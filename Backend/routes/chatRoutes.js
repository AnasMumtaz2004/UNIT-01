const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const { protect } = require("../middleware/authMiddleware");

// Groq API
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Send message, get AI reply, save to db
router.post("/", protect, async (req, res) => {
  const { message, chatId } = req.body;

  try {
    let chat;

    if (chatId) {
      chat = await Chat.findById(chatId);

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

    const groqMessages = chat.messages.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        max_tokens: 1024,
      }),
    });

    const groqData = await groqRes.json();

    if (!groqRes.ok) {
      console.log("Groq error:", JSON.stringify(groqData, null, 2));

      const status = groqRes.status;
      const errMsg = groqData?.error?.message || "";

      if (status === 429) {
        return res.status(429).json({ message: "Rate limit hit. Wait a moment and try again." });
      }

      if (status === 401) {
        return res.status(401).json({ message: "Invalid GROQ_API_KEY — check your .env file." });
      }

      return res.status(500).json({ message: "Groq error: " + errMsg });
    }

    const aiReply = groqData.choices[0].message.content;

    chat.messages.push({ role: "assistant", content: aiReply });
    await chat.save();

    res.json({
      chatId: chat._id,
      reply: aiReply,
      title: chat.title,
      messages: chat.messages,
    });

  } catch (error) {
    console.log("Chat route error:", error.message);
    res.status(500).json({ message: "Something went wrong: " + error.message });
  }
});


// Get all chats for sidebar
router.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select("title createdAt updatedAt")
      .sort({ updatedAt: -1 });

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

    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(chat);
  } catch (error) {
    console.log("Get chat error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// Delete a chat
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