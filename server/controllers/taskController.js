const mongoose = require("mongoose")
const Task = require("../models/Task")

// Create a new task
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body)

    res.status(201).json({
      success: true,
      task,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })

    res.json({
      success: true,
      tasks,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    })
  }
}

// Get one task
const getTaskById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      })
    }

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      })
    }

    res.json({
      success: true,
      task,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    })
  }
}

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params

    // Check MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      })
    }

    // Find existing task
    const existingTask = await Task.findById(id)

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      })
    }

    // Check status transition
    if (req.body.status && req.body.status !== existingTask.status) {
      const currentStatus = existingTask.status
      const newStatus = req.body.status

      const validTransition =
        (currentStatus === "Pending" && newStatus === "In Progress") ||
        (currentStatus === "In Progress" && newStatus === "Completed")

      if (!validTransition) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition: ${currentStatus} → ${newStatus}`,
        })
      }
    }

    // Do not allow completed tasks to move backward
    if (
      existingTask.status === "Completed" &&
      req.body.status &&
      req.body.status !== "Completed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Completed tasks cannot move backward",
      })
    }

    const task = await Task.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    res.json({
      success: true,
      task,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    // Check MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      })
    }

    const task = await Task.findByIdAndDelete(id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      })
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    })
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
}