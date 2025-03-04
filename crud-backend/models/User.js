const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  avatar: String,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
