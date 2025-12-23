import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invitation from "@/models/Invitation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400 }
    );
  }

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
    
    const { slug, ...updateData } = data;

    if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

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
