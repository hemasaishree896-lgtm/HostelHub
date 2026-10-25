
const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");

// GET leave requests: all for the warden,
// or only one student's requests when studentId is supplied.
router.get("/", async (req, res) => {
  try {
    const filter = req.query.studentId
      ? { studentId: req.query.studentId }
      : {};

    const leaves = await Leave.find(filter).sort({
      createdAt: -1,
      _id: -1
    });

    res.json(leaves);
  } catch (error) {
    console.error("Fetch leaves error:", error);
    res.status(500).json({
      message: "Failed to fetch leave requests"
    });
  }
});

// POST a new leave request
router.post("/", async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      studentEmail,
      fromDate,
      toDate,
      reason
    } = req.body;

    if (
      !studentId ||
      !studentName ||
      !fromDate ||
      !toDate ||
      !reason
    ) {
      return res.status(400).json({
        message: "Please provide all required leave details"
      });
    }

    const leave = await Leave.create({
      studentId,
      studentName,
      studentEmail: studentEmail || "",
      fromDate,
      toDate,
      reason
    });

    res.status(201).json(leave);
  } catch (error) {
    console.error("Submit leave error:", error);
    res.status(500).json({
      message: "Failed to submit leave request"
    });
  }
});

// PATCH leave request status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid leave status"
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }

    res.json(leave);
  } catch (error) {
    console.error("Update leave error:", error);
    res.status(500).json({
      message: "Failed to update leave status"
    });
  }
});

module.exports = router;
