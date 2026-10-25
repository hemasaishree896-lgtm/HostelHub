
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

// Verify that the logged-in user is a warden
async function verifyWarden(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please log in as a warden."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const warden = await User.findById(decoded.id);

    if (!warden || warden.role !== "warden") {
      return res.status(403).json({
        message: "Only a warden can perform this action."
      });
    }

    req.warden = warden;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired login. Please log in again."
    });
  }
}

// REGISTER STUDENT
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, room } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    // Public registration can only create student accounts
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
      room: room || "A-101"
    });

    return res.status(201).json({
      message: "Registration successful!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        room: newUser.room
      }
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Unable to register. Please try again."
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from .env");

      return res.status(500).json({
        message: "Server authentication is not configured."
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    return res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        room: user.room
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Unable to log in. Please try again."
    });
  }
});

// GET ALL STUDENTS — WARDEN ONLY
router.get("/students", verifyWarden, async (req, res) => {
  try {
    const students = await User.find({
      role: "student"
    })
      .select("-password")
      .sort({ createdAt: 1 });

    return res.json(students);
  } catch (error) {
    console.error("Load students error:", error.message);

    return res.status(500).json({
      message: "Unable to load students."
    });
  }
});

// REMOVE A STUDENT — WARDEN ONLY
router.delete(
  "/students/:id",
  verifyWarden,
  async (req, res) => {
    try {
      const studentId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({
          message: "Invalid student ID."
        });
      }

      const student = await User.findById(studentId);

      if (!student || student.role !== "student") {
        return res.status(404).json({
          message: "Student account not found."
        });
      }

      await User.findByIdAndDelete(studentId);

      return res.json({
        message: "Student removed successfully.",
        studentId
      });
    } catch (error) {
      console.error("Remove student error:", error.message);

      return res.status(500).json({
        message: "Unable to remove student."
      });
    }
  }
);

module.exports = router;
