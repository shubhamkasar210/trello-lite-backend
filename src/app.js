const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const bcrypt = require("bcrypt");

app.use(express.json());

// adding middlewares

const User = require("./models/user");

app.post("/signup", async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userName: userName,
      email: email,
      password: hashPassword,
    });

    await user.save(user);
    res.send("User added successfully!!!");
  } catch (err) {
    res.status(400).send("User not added.");
  }
});

app.post("/login", async (req, res) => {});

app.post("/logout", async (req, res) => {});

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
