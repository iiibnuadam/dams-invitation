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
    
    // Strip slug, _id, and __v to prevent immutable field errors
    const { slug: _ignore, _id: _ignoreId, __v: _ignoreV, ...updateData } = data;
    const slug = "main";

    // Sanitize empty string date fields to prevent Mongoose CastErrors
    if (updateData.acara && Array.isArray(updateData.acara)) {
      updateData.acara = updateData.acara.map((event: any) => {
        const cleaned = { ...event };
        if (cleaned.tanggalEnd === "" || cleaned.tanggalEnd === null) {
          delete cleaned.tanggalEnd;
        }
        if (cleaned.tanggal === "" || cleaned.tanggal === null) {
          delete cleaned.tanggal;
        }
        return cleaned;
      });
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
