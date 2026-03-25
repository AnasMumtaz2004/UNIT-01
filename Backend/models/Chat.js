const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})
const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tittle: {
        type: String,
        deafault: "New Chat",
    },
    messages: [messageSchema],
},
    {
        timestamps: true,
    }
);

const Chat =mongoose.model("Chat",chatSchema);
module.exports=Chat;