import { NextResponse } from "next/server";
import { updateServerUser } from "@/lib/serverDb";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, email, updates } = body;

    if (!id && !email) {
      return NextResponse.json(
        { success: false, message: "User identifier required." },
        { status: 400 }
      );
    }

    const updated = updateServerUser(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "User not found to update." },
        { status: 404 }
      );
    }

    const safeUser = { ...updated };
    delete safeUser.password;

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: safeUser,
    });
  } catch (error) {
    console.error("Profile update API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile." },
      { status: 500 }
    );
  }
}
