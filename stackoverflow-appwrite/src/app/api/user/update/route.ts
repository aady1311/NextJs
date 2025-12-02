import { NextResponse } from "next/server";
import { users } from "@/src/models/server/config";

export async function PATCH(request: Request) {
  try {
    const { userId, name, description } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    if (name) {
      await users.updateName(userId, name);
    }

    if (description !== undefined) {
      await users.updatePrefs(userId, { description });
    }

    return NextResponse.json({ 
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}