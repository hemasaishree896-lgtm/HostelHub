
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "warden"],
      default: "student"
    },

    room: {
      type: String,
      default: "A-101"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
