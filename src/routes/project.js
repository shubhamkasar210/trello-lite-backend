// Projects - create, update, delete, view
const express = require("express");
const projectRouter = express.Router();
const Project = require("../models/project");

projectRouter.get("/project", async(req, res) => {
    try {
        // get all projects
        const Projects = await Project.find({});
        if(Projects.length == 0) {
            throw new Error();
        }
        res.send(Projects);
    } catch (err) {
        res.status(404).send("Something went wrong.");
    }
});

projectRouter.post("/project", async(req, res) => {
    try {
        const {title, description} = req.body;
        
    } catch (err) {
        
    }
});

projectRouter.patch("/project/:id", async(req, res) => {
    try {
        
    } catch (err) {
        
    }
});

projectRouter.delete("/project/:id", async(req, res) => {
    try {
        
    } catch (err) {
        
    }
});

module.exports = { projectRouter }