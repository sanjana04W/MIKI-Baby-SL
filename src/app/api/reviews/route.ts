import { NextResponse } from "next/server";
import {
  getApprovedReviewsByProductId,
  createReview,
  hasCustomerReviewedProduct,
} from "@/lib/reviewsDb";
import { getServerOrders } from "@/lib/serverDb";
import { Review } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/reviews?productId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "productId parameter is required." },
        { status: 400 }
      );
    }

    const reviews = getApprovedReviewsByProductId(productId);
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
        : 5.0;

    return NextResponse.json({
      success: true,
      reviews,
      totalReviews,
      averageRating,
    });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

// POST /api/reviews
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productId,
      productSlug,
      productName,
      author,
      customerId,
      customerEmail,
      rating,
      title,
      comment,
    } = body;

    // Basic field validation
    if (!productId || !author || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: "Please provide all required review fields (rating and comment)." },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5 stars." },
        { status: 400 }
      );
    }

    // Purchase verification check against server orders
    const allOrders = getServerOrders();
    const normalizedEmail = (customerEmail || "").trim().toLowerCase();
    const targetProductId = (productId || "").trim().toLowerCase();
    const targetProductName = (productName || "").trim().toLowerCase();

    // Find any active order matching customer that contains this product
    const matchingOrder = allOrders.find((order) => {
      if (!order) return false;
      const orderCustEmail = (order.customerInfo?.email || "").trim().toLowerCase();
      const orderCustId = order.customerId || "";

      const isCustomerMatch =
        (customerId && orderCustId === customerId) ||
        (normalizedEmail && orderCustEmail === normalizedEmail);

      if (!isCustomerMatch) return false;

      // Check if order contains the product
      const hasProduct =
        Array.isArray(order.items) &&
        order.items.some((item) => {
          const itemProdId = (item.productId || "").trim().toLowerCase();
          const itemName = (item.name || "").trim().toLowerCase();
          return (
            itemProdId === targetProductId ||
            (targetProductName && itemName.includes(targetProductName)) ||
            (targetProductName && targetProductName.includes(itemName))
          );
        });

      return hasProduct && order.orderStatus !== "Cancelled";
    });

    if (!matchingOrder) {
      return NextResponse.json(
        {
          success: false,
          isUnverified: true,
          message:
            "Only verified customers who have purchased this product can submit a review. We could not find a completed purchase for this account.",
        },
        { status: 403 }
      );
    }

    // Check duplicate review
    const customerIdentifier = customerId || normalizedEmail;
    if (hasCustomerReviewedProduct(customerIdentifier, productId)) {
      return NextResponse.json(
        {
          success: false,
          isDuplicate: true,
          message: "You have already submitted a review for this product. Thank you for your feedback!",
        },
        { status: 409 }
      );
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId,
      productSlug: productSlug || "",
      productName: productName || "MIKI Wall Art & Gifts",
      author: author.trim(),
      customerId: customerIdentifier,
      orderId: matchingOrder.orderId,
      rating: numericRating,
      title: title ? title.trim() : undefined,
      comment: comment.trim(),
      date: formattedDate,
      createdAt: now.toISOString(),
      verified: true,
      status: "approved", // Automatically approved for instant visibility, manageable by admin
    };

    const saved = createReview(newReview);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your verified review has been published.",
        review: saved,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error while saving review." },
      { status: 500 }
    );
  }
}
