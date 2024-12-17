const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGO_URI;

const connectDB = async () => {
    console.log("connecting to db...")
  try {
    await mongoose.connect(uri);
    console.log("Connected to DB!");
  } catch (err) {
    console.error("Error in connecting to DB", err);
  }
};

module.exports = connectDB;
