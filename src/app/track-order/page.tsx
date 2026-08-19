"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  Search,
  CheckCircle,
  Clock,
  Package,
  MapPin,
  MessageCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { useStore } from "@/context/StoreContext";
import { formatPrice, formatDate, generateWhatsAppOrderLink } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";

export default function TrackOrderPage() {
  const { orders } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const term = searchInput.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderId.toLowerCase() === term ||
        o.customerInfo.phone.replace(/\s+/g, "").includes(term.replace(/\s+/g, ""))
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const steps: OrderStatus[] = ["Pending", "Confirmed", "Processing", "Dispatched", "Completed"];

  const getStepIndex = (status: OrderStatus) => {
    if (status === "Cancelled") return -1;
    return steps.indexOf(status);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-12 w-full space-y-10">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-miki-lightSky text-miki-sky rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Track Your Cash on Delivery Order</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Enter your Order Reference Number (e.g. <strong className="text-slate-800">MIKI-2026-1001</strong>) or your Mobile Number below.
          </p>
        </div>

        {/* Search Form */}
        <div className="glass-card rounded-3xl p-6 border border-slate-100 max-w-xl mx-auto">
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order Ref (MIKI-2026-XXXX) or Phone..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="bg-miki-pink hover:bg-miki-rose text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Results Display */}
        {hasSearched && (
          <div className="animate-fadeIn">
            {!searchedOrder ? (
              <div className="glass-card rounded-3xl p-8 text-center space-y-3 border border-rose-200 bg-rose-50/40 max-w-xl mx-auto">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Order Reference Not Found</h3>
                <p className="text-xs text-slate-500">
                  We couldn't find an order matching "{searchInput}". Please double check your order receipt or contact our WhatsApp helpline.
                </p>
                <a
                  href="https://wa.me/94767568100"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow mt-2"
                >
                  <MessageCircle className="w-4 h-4" /> Ask WhatsApp Support
                </a>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-8 border border-slate-100 shadow-xl">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-miki-pink uppercase tracking-widest">
                      Live Delivery Status
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">{searchedOrder.orderId}</h2>
                    <p className="text-xs text-slate-500">Placed on {formatDate(searchedOrder.createdAt)}</p>
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase shadow-sm ${
                      searchedOrder.orderStatus === "Cancelled"
                        ? "bg-rose-100 text-rose-800"
                        : searchedOrder.orderStatus === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-miki-pink/10 text-miki-pink"
                    }`}
                  >
                    Current Status: {searchedOrder.orderStatus}
                  </span>
                </div>

                {/* Progress Stepper Timeline */}
                {searchedOrder.orderStatus !== "Cancelled" && (
                  <div className="py-4">
                    <div className="grid grid-cols-5 gap-2 relative text-center">
                      {steps.map((st, idx) => {
                        const activeIdx = getStepIndex(searchedOrder.orderStatus);
                        const isDone = idx <= activeIdx;
                        const isCurrent = idx === activeIdx;

                        return (
                          <div key={st} className="flex flex-col items-center space-y-2 relative z-10">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow ${
                                isCurrent
                                  ? "bg-miki-pink text-white ring-4 ring-miki-pink/20 scale-110"
                                  : isDone
                                  ? "bg-emerald-500 text-white"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {isDone ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                            </div>
                            <span className={`text-[11px] font-bold ${isCurrent ? "text-miki-pink" : isDone ? "text-slate-800" : "text-slate-400"}`}>
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order Summary & Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                      Delivery Address
                    </span>
                    <p className="font-bold text-slate-900">{searchedOrder.customerInfo.name}</p>
                    <p>{searchedOrder.customerInfo.address}</p>
                    <p className="font-bold text-slate-900">District: {searchedOrder.customerInfo.district}</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                      Payment Details
                    </span>
                    <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
                    <p className="text-sm font-black text-slate-900">
                      Total Cash Payable: <span className="text-miki-rose">{formatPrice(searchedOrder.totalAmount)}</span>
                    </p>
                  </div>
                </div>

                {/* WhatsApp Action */}
                <div className="flex justify-center pt-2">
                  <a
                    href={generateWhatsAppOrderLink(
                      searchedOrder.customerInfo.phone,
                      searchedOrder.orderId,
                      searchedOrder.customerInfo.name,
                      searchedOrder.totalAmount,
                      searchedOrder.items.length
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" /> Direct WhatsApp Assistance for this Order
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
