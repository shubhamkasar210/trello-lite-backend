const Project = require("../models/project");

const ownerAuth = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const projectId = req.params.id || req.body.projectId;

    if (!projectId) {
      return res.status(400).send("Project ID is required");
    }

    if (!userId) {
      return res.status(401).send("Unauthorized: User not found in request");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send("Project not found");
    }

    if (project.owner.toString() !== userId.toString()) {
      return res.status(403).send("Access denied: Only project owner allowed");
    }

    req.project = project;
    next();
  } catch (err) {
    console.error("Owner Authentication Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { ownerAuth };
