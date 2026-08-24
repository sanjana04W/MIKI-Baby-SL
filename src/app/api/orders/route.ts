import { NextResponse } from "next/server";
import { getServerOrders, createServerOrder, saveServerOrders } from "@/lib/serverDb";
import { Order } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const email = searchParams.get("email");

    let orders = getServerOrders();

    if (customerId) {
      orders = orders.filter((o) => o.customerId === customerId);
    } else if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      orders = orders.filter(
        (o) => o.customerInfo?.email?.trim().toLowerCase() === normalizedEmail
      );
    }

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Orders API GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const orderData: Order = await request.json();

    if (!orderData || !orderData.orderId) {
      return NextResponse.json(
        { success: false, message: "Invalid order data." },
        { status: 400 }
      );
    }

    const savedOrder = createServerOrder(orderData);

    return NextResponse.json({
      success: true,
      order: savedOrder,
    });
  } catch (error) {
    console.error("Orders API POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save order." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { orderId, status, cancellationReason, internalNotes } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID required." },
        { status: 400 }
      );
    }

    const orders = getServerOrders();
    const updatedOrders = orders.map((o) => {
      if (o.orderId === orderId) {
        return {
          ...o,
          orderStatus: status || o.orderStatus,
          cancellationReason: cancellationReason ?? o.cancellationReason,
          internalNotes: internalNotes ?? o.internalNotes,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });

    saveServerOrders(updatedOrders);

    return NextResponse.json({
      success: true,
      message: "Order updated successfully.",
    });
  } catch (error) {
    console.error("Orders API PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order." },
      { status: 500 }
    );
  }
}
