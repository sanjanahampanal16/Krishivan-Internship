const express = require("express")
const cors = require("cors")
const taskRoutes = require("./routes/taskRoutes")

const app = express()

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
)
app.use(express.json())

app.use("/api/tasks", taskRoutes)

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Krishivan API is running",
  })
})

module.exports = app