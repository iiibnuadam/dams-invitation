import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

async function seedUser() {
  try {
    const opts = {
      bufferCommands: false,
    };

    await mongoose.connect(MONGODB_URI!, opts);
    console.log("Connected to MongoDB for User Seeding");

    // Check if admin exists
    const existingUser = await User.findOne({ email: "admin@example.com" });
    if (existingUser) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin",
    });

    console.log("Admin user created successfully");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding user:", error);
    process.exit(1);
  }
}

seedUser();
