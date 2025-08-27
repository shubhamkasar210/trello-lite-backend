const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth");
const { projectRouter } = require("./routes/project");
const { taskRouter } = require("./routes/task");

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong." });
});

connectDB()
  .then(() => {
    console.log("Database Connection Established Successfully!!!");
    app.listen(7777, () => {
      console.log("server is successfully listening on port 7777");
    });
  })
  .catch(() => {
    console.error("Database Connection Not Established");
  });
