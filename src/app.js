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
    res.status(400).send("User not added. Error - " + err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // if user is present in the db or not
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).send("User not found.");
    }

    // password is correct or not
    const isAuthenticated = await bcrypt.compare(password, user.password);

    if (isAuthenticated) {
      res.send("Login Successfull!!!");
    } else {
      res.send("Login failed.");
    }
  } catch (err) {
    res.status(401).send("Invalid Credentials. Error - " + err);
  }
});

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
