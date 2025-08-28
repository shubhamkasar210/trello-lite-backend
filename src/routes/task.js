const express = require("express");
const taskRouter = express.Router();
const Task = require("../models/task");
const Project = require("../models/project");

const { userAuth } = require("../middlewares/auth");
const { memberAuth } = require("../middlewares/member");

// Fetch all tasks from projects where user is member or owner
taskRouter.get("/tasks", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).select("_id");

    const projectIds = projects.map((p) => p._id);

    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate("assignee", "userName email")
      .populate("project", "title");

    if (!tasks.length) {
      return res.status(404).send("No tasks found for your projects.");
    }

    res.status(200).json(tasks);
  } catch (err) {
    console.error("GET /tasks error:", err);
    res.status(500).send("Something went wrong.");
  }
});

// Create a task in a project (must be a member)
taskRouter.post("/tasks", userAuth, memberAuth, async (req, res) => {
  try {
    const { projectId, title, description, assignee, dueDate, status } =
      req.body;

    if (!projectId || !title) {
      return res.status(400).send("Project ID and title are required");
    }

    const newTask = new Task({
      project: projectId,
      title,
      description,
      assignee,
      dueDate,
      status,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("POST /tasks error:", err);
    res.status(500).send("Failed to create task");
  }
});

// Update task fields (if user is a project member)
taskRouter.patch("/tasks/:id", userAuth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).send("Project not found");

    const isMember =
      project.owner.toString() === userId.toString() ||
      project.members.some((m) => m.toString() === userId.toString());

    if (!isMember)
      return res.status(403).send("Access denied: Not a project member");

    const updates = {};
    const allowedFields = [
      "title",
      "description",
      "assignee",
      "dueDate",
      "status",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (
      updates.status &&
      !["To Do", "In Progress", "Done"].includes(updates.status)
    ) {
      return res.status(400).send("Invalid status value");
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
    });
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("PATCH /tasks/:id error:", err);
    res.status(500).send("Failed to update task");
  }
});

// Delete a task (only project members)
taskRouter.delete("/tasks/:id", userAuth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).send("Project not found");

    const isMember =
      project.owner.toString() === userId.toString() ||
      project.members.some((m) => m.toString() === userId.toString());

    if (!isMember)
      return res.status(403).send("Access denied: Not a project member");

    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("DELETE /tasks/:id error:", err);
    res.status(500).send("Failed to delete task");
  }
});

// Get specific task details (must be member)
taskRouter.get("/tasks/:id", userAuth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    const task = await Task.findById(taskId)
      .populate("assignee", "userName email")
      .populate("project", "title members owner");

    if (!task) return res.status(404).send("Task not found");

    const project = task.project;
    const isMember =
      project.owner.toString() === userId.toString() ||
      project.members.some((m) => m.toString() === userId.toString());

    if (!isMember)
      return res.status(403).send("Access denied: Not a project member");

    res.status(200).json(task);
  } catch (err) {
    console.error("GET /task/:id error:", err);
    res.status(500).send("Failed to get task details");
  }
});

// Update only the status field of a task
taskRouter.patch("/tasks/:id/status", userAuth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;
    const userId = req.user._id;

    if (!["To Do", "In Progress", "Done"].includes(status)) {
      return res.status(400).send("Invalid status value");
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).send("Project not found");

    const isMember =
      project.owner.toString() === userId.toString() ||
      project.members.some((m) => m.toString() === userId.toString());

    if (!isMember)
      return res.status(403).send("Access denied: Not a project member");

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    console.error("PATCH /task/:id/status error:", err);
    res.status(500).send("Failed to update task status");
  }
});

module.exports = { taskRouter };
