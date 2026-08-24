import { NextResponse } from "next/server";
import { resetServerUserPassword, findServerUserByEmail } from "@/lib/serverDb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedPassword = (newPassword || "").trim();

    if (!trimmedEmail || !trimmedPassword) {
      return NextResponse.json(
        { success: false, message: "Please provide your email and new password." },
        { status: 400 }
      );
    }

    if (trimmedPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const updated = resetServerUserPassword(trimmedEmail, trimmedPassword);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    const user = findServerUserByEmail(trimmedEmail);

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset! You can now sign in from any device with your new password.",
      user: {
        id: user?.id || `cust-${Date.now()}`,
        name: user?.name || trimmedEmail.split("@")[0],
        email: trimmedEmail,
        phone: user?.phone || "",
      },
    });
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error resetting password." },
      { status: 500 }
    );
  }
}
