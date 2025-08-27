const express = require("express");
const app = express();
require("./config/database");

app.use("/", (req, res) => {
  res.send("Hello World");
});

app.listen(7777, () => {
  console.log("server is successfully listening on port 7777");
});
