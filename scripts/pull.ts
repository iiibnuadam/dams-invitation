import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import dbConnect from "../lib/mongodb";
import Invitation from "../models/Invitation";

async function pull() {
  const slug = process.argv[2] || "main";

  try {
    await dbConnect();
    console.log(`Connected to MongoDB. Fetching slug: ${slug}`);

    const invitation = await Invitation.findOne({ slug }).lean();

    if (!invitation) {
      console.error(`Invitation with slug '${slug}' not found.`);
      process.exit(1);
    }

    // Remove DB specific fields and the slug itself from the export
    const { _id, __v, createdAt, updatedAt, slug: _, ...cleanData } = invitation as any;

    // Remove _id from subdocuments if any (Mongoose .lean() still keeps them sometimes or if arrays)
    // A simple JSON parse/stringify replay can help if we want to be sure, 
    // but explicit deletion is better for nested arrays usually.
    // However, for seeding, having _id in subdocs usually doesn't hurt unless we want fresh ones.
    // Let's recursively remove _id.
    const removeIds = (obj: any): any => {
        if (Array.isArray(obj)) {
            return obj.map(removeIds);
        } else if (obj !== null && typeof obj === 'object') {
            const { _id, ...rest } = obj; // Destructure _id out
            
            // Recursively process other keys
            for (const key in rest) {
                rest[key] = removeIds(rest[key]);
            }
            return rest;
        }
        return obj;
    };

    const finalData = removeIds(cleanData);

    const filePath = path.join(process.cwd(), "scripts/data/seed.json");
    await fs.writeFile(filePath, JSON.stringify(finalData, null, 2));

    console.log(`Successfully pulled data from MongoDB to ${filePath}`);
    process.exit(0);

  } catch (error) {
    console.error("Pull failed:", error);
    process.exit(1);
  }
}

pull();
