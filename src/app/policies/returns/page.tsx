"use client";

import React from "react";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-12 w-full space-y-8">
        <div className="space-y-2 text-center">
          <RotateCcw className="w-10 h-10 text-miki-rose mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900">Exchange & Return Policy</h1>
          <p className="text-xs text-slate-500">Customer satisfaction guarantee for Miky Baby SL</p>
        </div>

        <div className="glass-card rounded-3xl p-8 space-y-6 border border-slate-100 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Damaged or Incorrect Items</h3>
            <p>
              If your nursery wall art or gift item arrives damaged, defective, or incorrect, please inform us within 48 hours of delivery via WhatsApp (076 756 8100) with a photo of the item. We will arrange a free replacement immediately.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Personalized Items</h3>
            <p>
              Personalized items (such as custom baby birth stats plaques with baby names) cannot be returned unless there is a printing or spelling error made by MIKI Baby SL.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. Return Shipping</h3>
            <p>
              Approved exchanges will be collected by our delivery rider or can be posted back to our Colombo fulfillment office.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
