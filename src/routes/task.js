// Tasks - create, update, delete, view
const express = require("express");
const taskRouter = express.Router();

taskRouter.get("/task", async(req, res) => {

});

taskRouter.post("/task", async(req, res) => {
    
});

taskRouter.patch("/task/:id", async(req, res) => {
    
});

taskRouter.delete("/task/:id", async(req, res) => {
    
});

module.exports = { taskRouter }