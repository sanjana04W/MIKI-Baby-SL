import { NextResponse } from "next/server";
import { getServerUsers } from "@/lib/serverDb";

export async function GET() {
  try {
    const users = getServerUsers();
    // Return sanitized users list without sensitive password fields
    const safeUsers = users.map((u) => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });

    return NextResponse.json({
      success: true,
      users: safeUsers,
    });
  } catch (error) {
    console.error("Users list API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users." },
      { status: 500 }
    );
  }
}
