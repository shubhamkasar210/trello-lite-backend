const express = require("express");
const projectRouter = express.Router();
const Project = require("../models/project");

const { userAuth } = require("../middlewares/auth");
const { ownerAuth } = require("../middlewares/owner");
const { memberAuth } = require("../middlewares/member");

// Get all projects user is a member of (Authenticated users)
projectRouter.get("/projects", userAuth, async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Get single project by ID if user is a member (Project members)
projectRouter.get("/projects/:id", userAuth, async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findOne({
      _id: projectId,
      members: req.user._id,
    })
      .populate("owner", "userName email")
      .populate("members", "userName email");

    if (!project) {
      return res
        .status(404)
        .json({ error: "Project not found or access denied" });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: "Error fetching project details" });
  }
});

// Create new project (Authenticated users)
projectRouter.post("/projects", userAuth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const project = new Project({
      title,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });

    await project.save();

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: "Error creating project." });
  }
});

// Update project title or description (Project owner only)
projectRouter.patch("/projects/:id", userAuth, ownerAuth, async (req, res) => {
  try {
    const updates = req.body;
    const projectId = req.params.id;

    const updatedProject = await Project.findByIdAndUpdate(projectId, updates, {
      new: true,
    });

    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: "Error updating project." });
  }
});

// Delete a project (Project owner only)
projectRouter.delete("/projects/:id", userAuth, ownerAuth, async (req, res) => {
  try {
    const projectId = req.params.id;
    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting project." });
  }
});

// Add member to project (Project owner only)
projectRouter.post(
  "/projects/:id/members",
  userAuth,
  ownerAuth,
  async (req, res) => {
    try {
      const { memberId } = req.body;
      const projectId = req.params.id;

      if (!memberId) {
        return res.status(400).json({ error: "memberId is required" });
      }

      // Use $addToSet to prevent duplicate members
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $addToSet: { members: memberId } },
        { new: true }
      )
        .populate("owner", "userName email")
        .populate("members", "userName email");

      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.status(200).json(updatedProject);
    } catch (err) {
      res.status(500).json({ error: "Error adding member." });
    }
  }
);

// List all members in project (Project members)
projectRouter.get(
  "/projects/:id/members",
  userAuth,
  memberAuth,
  async (req, res) => {
    try {
      const project = await Project.findOne({
        _id: req.params.id,
        members: req.user._id,
      })
        .populate("owner", "userName email role")
        .populate("members", "userName email role");

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json([project.owner, ...project.members]);
    } catch (err) {
      res.status(500).json({ error: "Failed to get project members" });
    }
  }
);

// Remove a member from project (Project owner only)
projectRouter.delete(
  "/projects/:id/members/:memberId",
  userAuth,
  ownerAuth,
  async (req, res) => {
    try {
      const { memberId } = req.params;
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      if (memberId === project.owner.toString()) {
        return res.status(400).json({ error: "Cannot remove project owner" });
      }

      project.members = project.members.filter(
        (id) => id.toString() !== memberId
      );

      await project.save();

      res.json({ message: "Member removed successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to remove member" });
    }
  }
);

module.exports = { projectRouter };
