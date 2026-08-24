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

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No account found with this email. Please check your spelling or create a new account.",
        },
        { status: 404 }
      );
    }

    // Generate 6-digit verification OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    return NextResponse.json({
      success: true,
      message: `Verification code generated for ${user.name}.`,
      user: { name: user.name, email: user.email },
      otpCode,
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error processing forgot password request." },
      { status: 500 }
    );
  }
}
