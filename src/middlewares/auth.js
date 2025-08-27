const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).send("Please login!!!");
    }

    const decoded = jwt.verify(token, "Iamshubham80@");

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send("User not found in database");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication Error:", err.message);
    res.status(401).send("Invalid or expired token");
  }
};

module.exports = { userAuth };
