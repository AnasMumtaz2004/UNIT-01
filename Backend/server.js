const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!")
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message)
    process.exit(1)
  })

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/chat", require("./routes/chatRoutes"))

app.get("/", (req, res) => {
  res.send("API is running...")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})