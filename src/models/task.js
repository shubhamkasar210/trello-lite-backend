const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  assignee: {
    type: String,
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
});

module.exports = mongoose.model("Task", taskSchema);
