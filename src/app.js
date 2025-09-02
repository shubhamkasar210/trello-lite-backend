const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

app.use(
  cors({
    origin: [
      "https://trello-lite-frontend-sk.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth");
const { projectRouter } = require("./routes/project");
const { taskRouter } = require("./routes/task");

app.use("/", authRouter);
app.use("/", projectRouter);
app.use("/", taskRouter);

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
