const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Load the .env file from the backend folder
require("dotenv").config({
  path: path.join(__dirname, ".env")
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/complaints", require("./routes/complaints"));
app.use("/api/leaves", require("./routes/leaves"));

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "HostelHub backend is running!"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    server: "running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    message: "Internal server error"
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

async function startServer() {
  try {
    // Check whether the MongoDB connection string exists
    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing. Check the backend .env file."
      );
    }

    // Check the connection string format without printing the secret
    if (!/^mongodb(\+srv)?:\/\//.test(MONGO_URI)) {
      throw new Error(
        "MONGO_URI has an invalid format. It must start with mongodb:// or mongodb+srv://."
      );
    }

    console.log("MongoDB connection string format is valid.");

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully.");

    // Start listening for requests
    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `HostelHub backend running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();
