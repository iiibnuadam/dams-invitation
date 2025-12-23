import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invitation from "@/models/Invitation";

export async function GET(request: Request) {
  // Single mode: always fetch "main"
  const slug = "main";

  try {
    await dbConnect();
    const invitation = await Invitation.findOne({ slug });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Single mode: always update "main"
    // We strip slug from input if present, though it doesn't matter as we query by "main"
    const { slug: _ignore, ...updateData } = data;
    const slug = "main";

    const invitation = await Invitation.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update invitation" }, { status: 500 });
  }
}
