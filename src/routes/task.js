// Tasks - create, update, delete, view
const express = require("express");
const taskRouter = express.Router();
const Task = require("../models/task");

taskRouter.get("/task", async(req, res) => {
    try {
        // get all tasks
        const Tasks = await Task.find({});
        if(Tasks.length == 0) {
            throw new Error();
        }
        res.send(Tasks);
    } catch (err) {
        res.status(404).send("Something went wrong.");
    }
});

taskRouter.post("/task", async(req, res) => {
    try {
        
    } catch (err) {
        
    }
});

taskRouter.patch("/task/:id", async(req, res) => {
    try {
        
    } catch (err) {
        
    }
});

taskRouter.delete("/task/:id", async(req, res) => {
    try {
        
    } catch (err) {
        
    }
});

module.exports = { taskRouter }