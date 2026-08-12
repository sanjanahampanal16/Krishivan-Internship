const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    assignedEmployee: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    relatedEntityType: {
      type: String,
      required: true,
      enum: ["FPO", "ME"],
    },

    relatedEntity: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

module.exports = mongoose.model("Task", taskSchema)