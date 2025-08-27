const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://shubhamkasar:iamshubham80@devcommune.huumbdw.mongodb.net/"
  );
};

connectDB()
  .then(() => {
    console.log("Database Connection Established Successfully!!!");
  })
  .catch(() => {
    console.error("Database Connection Not Established");
  });
