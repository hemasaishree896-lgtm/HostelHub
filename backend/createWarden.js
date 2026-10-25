
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
require("dotenv").config();

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
    const name = await ask("Enter warden name: ");
    const email = (
      await ask("Enter warden email: ")
    ).trim().toLowerCase();
    const password = await ask("Create warden password (minimum 6 characters): ");

    if (!name.trim() || !email || password.length < 6) {
      throw new Error(
        "Name, email and a password of at least 6 characters are required."
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.name = name.trim();
      existingUser.password = hashedPassword;
      existingUser.role = "warden";
      await existingUser.save();

      console.log("Existing account updated to warden.");
    } else {
      await User.create({
        name: name.trim(),
        email,
        password: hashedPassword,
        role: "warden",
        room: "N/A"
      });

      console.log("Warden account created successfully.");
    }

    console.log("You can now log in using the email and password you entered.");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect().catch(() => {});
    rl.close();
  }
}

createWarden();
