const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

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

    await user.save(user);
    res.send("User added successfully!!!");
  } catch (err) {
    res.status(400).send("User not added. Error - " + err);
  }
});

authRouter.post("/auth/login", async (req, res) => {
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
      const token = await jwt.sign({ _id: user._id }, "Iamshubham80@");
      res.cookie("token", token);

      res.send("Login Successfull!!!");
    } else {
      res.send("Login failed.");
    }
  } catch (err) {
    res.status(401).send("Invalid Credentials. Error - " + err);
  }
});

authRouter.get("/auth/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout Successfull!!!");
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

module.exports = { authRouter };
