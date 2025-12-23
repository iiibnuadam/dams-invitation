import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import dbConnect from "../lib/mongodb";
import Invitation from "../models/Invitation";

async function seed() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    const filePath = path.join(process.cwd(), "scripts/data/seed.json");
    
    // Check if seed file exists
    try {
        await fs.access(filePath);
    } catch {
        console.error("Seed file not found at scripts/data/seed.json. Please run 'npm run seed:pull' first or create the file.");
        process.exit(1);
    }

    const fileContent = await fs.readFile(filePath, "utf-8");
    const seedData = JSON.parse(fileContent);

    // Force default slug
    const finalData = { ...seedData, slug: "main" };

    await Invitation.deleteMany({ slug: "main" });
    console.log(`Deleted existing invitation for slug: main`);

    await Invitation.create(finalData);
    console.log("Seeding successful from JSON file");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
