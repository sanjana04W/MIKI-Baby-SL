import { NextResponse } from "next/server";
import { findServerUserByEmail } from "@/lib/serverDb";

// Always run fresh — never serve a cached login response
export const dynamic = "force-dynamic";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedPassword = (password || "").trim();

    if (!trimmedEmail || !trimmedPassword) {
      return NextResponse.json(
        { success: false, message: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const foundUser = findServerUserByEmail(trimmedEmail);

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Account not found with this email. If you do not have an account, you must create an account first.",
        },
        { status: 404 }
      );
    }

    if (foundUser.password && foundUser.password !== trimmedPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password. Please check your password and try again.",
        },
        { status: 401 }
      );
    }

    // Login successful
    const sessionUser = { ...foundUser };
    delete sessionUser.password;

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${sessionUser.name}! Logged in successfully. 👏`,
      user: sessionUser,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error while signing in." },
      { status: 500 }
    );
  }
}
