const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,   // <-- this is why it’s failing
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  googleId: {
    type: String, // for Google auth
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
