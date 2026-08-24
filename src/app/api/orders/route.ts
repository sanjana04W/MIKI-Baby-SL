import { NextResponse } from "next/server";
import { getServerOrders, createServerOrder, saveServerOrders } from "@/lib/serverDb";
import { Order } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    let orders = getServerOrders();

    if (customerId || email || phone) {
      const normalizedEmail = email ? email.trim().toLowerCase() : "";
      const normalizedPhone = phone ? phone.replace(/\D/g, "").replace(/^94/, "0").replace(/^0+/, "") : "";

      orders = orders.filter((o) => {
        // Match by customerId
        if (customerId && o.customerId && o.customerId === customerId) return true;

        // Match by email
        if (
          normalizedEmail &&
          o.customerInfo?.email &&
          o.customerInfo.email.trim().toLowerCase() === normalizedEmail
        ) {
          return true;
        }

        // Match by normalized phone
        if (normalizedPhone && o.customerInfo?.phone) {
          const oPhone = o.customerInfo.phone.replace(/\D/g, "").replace(/^94/, "0").replace(/^0+/, "");
          if (oPhone && oPhone === normalizedPhone) return true;
        }

        return false;
      });
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
