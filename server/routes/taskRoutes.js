const express = require("express")

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController")

const router = express.Router()

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