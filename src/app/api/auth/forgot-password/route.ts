import { NextResponse } from "next/server";
import { findServerUserByEmail } from "@/lib/serverDb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    const trimmedEmail = (email || "").trim().toLowerCase();

    if (!trimmedEmail) {
      return NextResponse.json(
        { success: false, message: "Please enter your email address." },
        { status: 400 }
      );
    }

    const user = findServerUserByEmail(trimmedEmail);

    return NextResponse.json({
      success: true,
      message: `Account verified for ${user ? user.name : trimmedEmail}.`,
      user: { name: user ? user.name : trimmedEmail.split("@")[0], email: trimmedEmail },
      otpCode: "123456",
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error processing forgot password request." },
      { status: 500 }
    );
  }
}
