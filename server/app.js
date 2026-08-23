const express = require("express")
const cors = require("cors")
const taskRoutes = require("./routes/taskRoutes")
const authRoutes = require("./routes/authRoutes")

const app = express()

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://krishivan-internship-1.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
   allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(express.json())

app.use("/api/tasks", taskRoutes)
app.use("/api/auth", authRoutes)

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Krishivan API is running",
  })
})

module.exports = app