import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getSession, login } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { email, password, name } = await request.json();

    // Sanitize ID (handle legacy session where ID might be an object)
    let userId = session.user.id;

    if (typeof userId === 'object' && userId !== null) {
        if ('buffer' in userId && typeof userId.buffer === 'object') {
            // Reconstruct ObjectId hex string from buffer object
            // The buffer comes as { '0': 105, '1': 74... }
            const bufferValues = Object.values(userId.buffer as object);
            userId = Buffer.from(bufferValues).toString('hex');
        } else {
            userId = userId.toString();
        }
    }

    const user = await User.findById(userId);
    if (!user) {
        console.error("User not found for ID:", session.user.id);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (email) user.email = email;
    if (name) user.name = name;
    
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Update session with new info
    await login({ id: user._id.toString(), email: user.email, name: user.name });

    return NextResponse.json({ success: true, user: { email: user.email, name: user.name } });

  } catch (error) {
    console.error("Update admin error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
