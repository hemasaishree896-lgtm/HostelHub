
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true
    },
    studentName: {
      type: String,
      required: true
    },
    studentEmail: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
