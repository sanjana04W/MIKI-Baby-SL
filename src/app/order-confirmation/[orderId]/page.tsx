"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  MessageCircle,
  Truck,
  Phone,
  MapPin,
  Calendar,
  Package,
  ClipboardList,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { useStore } from "@/context/StoreContext";
import { formatPrice, formatDate, generateWhatsAppOrderLink } from "@/lib/utils";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { orders } = useStore();

  const order = orders.find((o) => o.orderId === orderId);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F472B6", "#FB7185", "#FBBF24", "#38BDF8"],
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Order Reference Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">Order ID #{orderId}</p>
          <Link href="/shop" className="bg-miki-pink text-white text-xs font-bold px-6 py-3 rounded-full shadow">
            Return to Store
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const whatsappUrl = generateWhatsAppOrderLink(
    order.customerInfo.phone,
    order.orderId,
    order.customerInfo.name,
    order.totalAmount,
    order.items.reduce((s, i) => s + i.quantity, 0)
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/40">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-12 w-full space-y-8">
        {/* Top Centered Status & Heading */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-7 h-7 stroke-[3]" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Thank You For Your Order!
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Your order has been received successfully. Below are your reference and shipping expectations.
          </p>

          <div className="pt-2">
            <span className="inline-block px-6 py-2 rounded-full bg-white border border-slate-200 text-xs font-black tracking-widest text-slate-800 uppercase shadow-xs">
              ORDER NUMBER: {order.orderId}
            </span>
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Details Card */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
              <Truck className="w-4 h-4 text-rose-500" />
              <span>SHIPPING DETAILS</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <p>
                <strong className="text-slate-900 font-bold">Recipient Name:</strong>{" "}
                {order.customerInfo.name}
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <strong className="text-slate-900 font-bold">Mobile Contact:</strong>{" "}
                {order.customerInfo.phone}
              </p>
              <p>
                <strong className="text-slate-900 font-bold">District:</strong>{" "}
                {order.customerInfo.district}
              </p>
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-slate-900 font-bold">Address:</strong>{" "}
                  {order.customerInfo.address}
                </span>
              </p>
              <p className="flex items-center gap-1.5 text-purple-700 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  <strong>Requested Delivery:</strong> {formatDate(order.createdAt)}
                </span>
              </p>
            </div>
          </div>

          {/* Order Information Card */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
              <Package className="w-4 h-4 text-purple-500" />
              <span>ORDER INFORMATION</span>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                <strong className="text-slate-900 font-bold">Payment Method:</strong>{" "}
                Cash on Delivery (COD)
              </p>

              <div className="flex items-center gap-2">
                <strong className="text-slate-900 font-bold">Fulfillment Status:</strong>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider">
                  {order.orderStatus || "PENDING"}
                </span>
              </div>

              {/* Delivery Estimation Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-[11px] font-black text-slate-800">Expected Delivery:</p>
                <p className="text-[11px] text-slate-500">Colombo/Gampaha: 1–3 Business Days.</p>
                <p className="text-[11px] text-slate-500">Outstations: 3–5 Business Days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Itemized Summary Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
            <ClipboardList className="w-4 h-4 text-slate-400" />
            <span>ORDERED ITEMIZED SUMMARY</span>
          </div>

          <div className="divide-y divide-slate-100 space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-4 first:pt-0 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</h3>
                  {item.personalizationDetails && (
                    <p className="text-[11px] text-miki-pink font-semibold mt-0.5">
                      Personalization: {item.personalizationDetails}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Qty: {item.quantity} @ {formatPrice(item.price)}
                  </p>
                </div>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-miki-rose font-bold">
                <span>Discount</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-slate-900">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total COD Payment</span>
              <span className="text-rose-600 text-lg sm:text-xl font-black">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Continue Shopping & WhatsApp Support */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-[#e11d48] hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-lg transition-all active:scale-95 text-center"
          >
            Continue Shopping
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#22c55e] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp Support Follow-up</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
