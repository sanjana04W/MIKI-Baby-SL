import { NextResponse } from "next/server";
import { updateServerUser, findServerUserByEmail, findServerUserById } from "@/lib/serverDb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    if (!email && !id) {
      return NextResponse.json(
        { success: false, message: "Email or ID is required to fetch profile." },
        { status: 400 }
      );
    }

    let user = undefined;
    if (email) {
      user = findServerUserByEmail(email);
    }
    if (!user && id) {
      user = findServerUserById(id);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const safeUser = { ...user };
    delete safeUser.password;

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Profile GET API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

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

    const updated = updateServerUser(id || "", updates || {}, email);
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
