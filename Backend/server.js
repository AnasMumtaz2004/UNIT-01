const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}))
app.use(express.json())

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!")
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message)
    process.exit(1)
  })

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/chat", require("./routes/chatRoutes"))

// Health Check Route
app.get("/", (req, res) => {
  res.send("API is running...")
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message)
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  })
})

// Start Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})