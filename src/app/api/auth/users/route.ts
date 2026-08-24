import { NextResponse } from "next/server";
import { getServerUsers, saveServerUsers, clearAllServerUsers } from "@/lib/serverDb";

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

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const clearAll = url.searchParams.get("all") === "true";

    if (clearAll) {
      clearAllServerUsers();
      return NextResponse.json({
        success: true,
        message: "All customer accounts deleted successfully.",
      });
    }

    if (email) {
      const users = getServerUsers();
      const normalized = email.trim().toLowerCase();
      const updated = users.filter((u) => u.email.trim().toLowerCase() !== normalized);
      saveServerUsers(updated);
      return NextResponse.json({
        success: true,
        message: `Account for ${email} deleted successfully.`,
      });
    }

    // If no params, clear all
    clearAllServerUsers();
    return NextResponse.json({
      success: true,
      message: "All customer accounts deleted successfully.",
    });
  } catch (error) {
    console.error("Delete user API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user(s)." },
      { status: 500 }
    );
  }
}

