
const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// GET complaints: all complaints for the warden,
// or only one student's complaints when studentId is supplied.
router.get("/", async (req, res) => {
  try {
    const filter = req.query.studentId
      ? { studentId: req.query.studentId }
      : {};

    const complaints = await Complaint.find(filter).sort({
      createdAt: -1,
      _id: -1
    });

    res.json(complaints);
  } catch (error) {
    console.error("Fetch complaints error:", error);
    res.status(500).json({
      message: "Failed to fetch complaints"
    });
  }
});

// POST a new complaint
router.post("/", async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      studentEmail,
      title,
      category,
      description
    } = req.body;

    if (
      !studentId ||
      !studentName ||
      !title ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        message: "Please provide all required complaint details"
      });
    }

    const complaint = await Complaint.create({
      studentId,
      studentName,
      studentEmail: studentEmail || "",
      title,
      category,
      description
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error("Submit complaint error:", error);
    res.status(500).json({
      message: "Failed to submit complaint"
    });
  }
});

// PATCH complaint status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({
        message: "Invalid complaint status"
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.json(complaint);
  } catch (error) {
    console.error("Update complaint error:", error);
    res.status(500).json({
      message: "Failed to update complaint status"
    });
  }
});

module.exports = router;
