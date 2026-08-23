const express = require("express")

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController")

const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

// All task routes require login
router.use(authMiddleware)

// Get all tasks
router.get("/", getTasks)

// Get one task
router.get("/:id", getTaskById)

// Create task
router.post("/", createTask)

// Update task
router.put("/:id", updateTask)

// Delete task
router.delete("/:id", deleteTask)

module.exports = router