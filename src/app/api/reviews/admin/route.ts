import { NextResponse } from "next/server";
import {
  getReviews,
  updateReviewStatus,
  deleteReview,
} from "@/lib/reviewsDb";

export const dynamic = "force-dynamic";

// GET /api/reviews/admin
export async function GET() {
  try {
    const reviews = getReviews();
    const total = reviews.length;
    const pending = reviews.filter((r) => r.status === "pending").length;
    const approved = reviews.filter((r) => r.status === "approved").length;
    const rejected = reviews.filter((r) => r.status === "rejected").length;
    const avgRating =
      total > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1))
        : 5.0;

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        total,
        pending,
        approved,
        rejected,
        avgRating,
      },
    });
  } catch (error) {
    console.error("GET /api/reviews/admin error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin reviews." },
      { status: 500 }
    );
  }
}

// PATCH /api/reviews/admin
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status || (status !== "approved" && status !== "rejected" && status !== "pending")) {
      return NextResponse.json(
        { success: false, message: "Valid review id and status ('approved' | 'rejected' | 'pending') required." },
        { status: 400 }
      );
    }

    const updated = updateReviewStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Review has been marked as ${status}.`,
      review: updated,
    });
  } catch (error) {
    console.error("PATCH /api/reviews/admin error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update review status." },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/admin?id=xxx
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Review id is required." },
        { status: 400 }
      );
    }

    const deleted = deleteReview(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Review not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/reviews/admin error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete review." },
      { status: 500 }
    );
  }
}
