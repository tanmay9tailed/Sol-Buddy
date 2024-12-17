const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: String,
  privateKey: String,
  publicKey: String,
});

const userModal = mongoose.model("User", userSchema);

module.exports = userModal;
