const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const path = require("path");

// Load .env from the backend folder
require("dotenv").config({
  path: path.join(__dirname, ".env")
});

// Load the User model
const User = require("./models/User");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createWarden() {
  try {
    // Check MongoDB connection string
    const mongoURI = process.env.MONGO_URI;

    if (
      !mongoURI ||
      !/^mongodb(\+srv)?:\/\//.test(mongoURI)
    ) {
      throw new Error(
        "MONGO_URI is missing or invalid. Check the MONGO_URI line in your backend .env file."
      );
    }

    console.log("MongoDB connection string format looks correct.");

    // Connect to MongoDB
    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully.");

    // Get warden details
    const name = (
      await ask("Enter warden name: ")
    ).trim();

    const email = (
      await ask("Enter warden email: ")
    ).trim().toLowerCase();

    const password = await ask(
      "Create warden password (minimum 6 characters): "
    );

    if (!name || !email || password.length < 6) {
      throw new Error(
        "Enter a name, a valid email, and a password of at least 6 characters."
      );
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find existing account
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.role = "warden";

      await existingUser.save();

      console.log("Existing account updated to warden.");
    } else {
      await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        role: "warden",
        room: "N/A"
      });

      console.log("Warden account created successfully.");
    }

    console.log(
      "Use the email and password you entered to log in."
    );
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect().catch(() => {});
    rl.close();
  }
}

createWarden();
