import { NextResponse } from "next/server";
import { findServerUserByEmail, createServerUser } from "@/lib/serverDb";
import { CustomerUser } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, address, district } = body;

    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedName = (name || "").trim();
    const trimmedPhone = (phone || "").trim();
    const trimmedPassword = (password || "").trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (trimmedPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if user already exists across the system
    const existing = findServerUserByEmail(trimmedEmail);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists. Please sign in with your password.",
        },
        { status: 409 }
      );
    }

    const newUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      password: trimmedPassword,
      address: address ? address.trim() : "",
      district: district || "Colombo",
      createdAt: new Date().toISOString(),
    };

    createServerUser(newUser);

    // Return safe user object (exclude password)
    const sessionUser = { ...newUser };
    delete sessionUser.password;

    return NextResponse.json(
      {
        success: true,
        message: `Welcome to MIKI Baby SL, ${sessionUser.name}! Your account has been created. 🎉`,
        user: sessionUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error while creating account." },
      { status: 500 }
    );
  }
}
