import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invitation from "@/models/Invitation";

export async function POST(request: Request) {
  try {
    const { name, message } = await request.json();

    if (!name || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const slug = "main";
    const normalizedName = name.trim();
    const normalizedMessage = message.trim();

    await dbConnect();
    
    // Check for existing invitation and potential spam
    const existingInvitation = await Invitation.findOne({ slug });
    if (!existingInvitation) {
         return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Simple Spam Protection: Check if the last comment is identical or very recent
    if (existingInvitation.comments.length > 0) {
        const lastComment = existingInvitation.comments[0]; // Assuming newest is at 0 or we sort? 
        // Note: Mongoose array push with $position: 0 puts it at front.
        // Wait, if map reduces it, we should check carefully.
        // Let's just check the latest few.
        
        // Actually, let's just use the finding.
        const isDuplicate = existingInvitation.comments.some((c: any) => 
            c.name === normalizedName && 
            c.message === normalizedMessage &&
            (new Date().getTime() - new Date(c.timestamp).getTime() < 60000) // 1 minute duplicate check
        );

        if (isDuplicate) {
             return NextResponse.json(
                { error: "You are posting too fast or duplicate message." },
                { status: 429 }
            );
        }
    }

    // Find invitation and push comment
    const updatedInvitation = await Invitation.findOneAndUpdate(
        { slug },
        { 
            $push: { 
                comments: { 
                    $each: [{ 
                        name: normalizedName, 
                        message: normalizedMessage, 
                        timestamp: new Date(), 
                        isVisible: true,
                        isFavorite: false 
                    }],
                    $position: 0 // Add to top
                } 
            } 
        },
        { new: true }
    );

    if (!updatedInvitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, comments: updatedInvitation.comments });
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
