const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ["To Do", "In Progress", "Done"],
        message: `{VALUE} is not a valid status`,
        default: "To Do",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
