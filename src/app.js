const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth");

app.use("/", authRouter);

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong.");
  }
  res.send("Hello World");
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
