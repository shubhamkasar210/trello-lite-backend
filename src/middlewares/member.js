const Project = require("../models/project");

const memberAuth = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const projectId = req.params.id || req.body.projectId;

    if (!projectId) {
      return res.status(400).send("Project ID is required");
    }

    if (!userId) {
      return res.status(401).send("Unauthorized: User ID missing");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send("Project not found");
    }

    const isMember = project.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).send("Access denied: Not a project member");
    }

    req.project = 
    project;
    next();
  } catch (err) {
    console.error("Member Authentication Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { memberAuth };
