const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Register a new user with hashed password
authRouter.post("/auth/signup", async (req, res) => {
  try {
    const { userName, password, email, role } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userName: userName,
      email: email,
      password: hashPassword,
      role: role,
    });

    await user.save();
    res.send("User added successfully!!!");
  } catch (err) {
    res.status(400).send("User not added. Error - " + err);
  }
});

// Login user, validate credentials, return jwt token
authRouter.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // if user is present in the db or not
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // password is correct or not
    const isAuthenticated = await bcrypt.compare(password, user.password);

    if (isAuthenticated) {
      const token = await jwt.sign({ _id: user._id }, "Iamshubham80@");
      res.cookie("token", token);

      res.json({
        message: "Login successful",
        user: { id: user._id, email: user.email, role: user.role },
      });
    } else {
      res.send("Login failed.");
    }
  } catch (err) {
    res.status(401).send("Invalid Credentials. Error - " + err);
  }
});

// Clear jwt cookie to log user out
authRouter.get("/auth/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

module.exports = { authRouter };
