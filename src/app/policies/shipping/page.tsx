"use client";

import React from "react";
import { Truck, ShieldCheck, MapPin } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-12 w-full space-y-8">
        <div className="space-y-2 text-center">
          <Truck className="w-10 h-10 text-miki-pink mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900">Islandwide Shipping & Delivery Policy</h1>
          <p className="text-xs text-slate-500">Fast, safe Cash on Delivery across Sri Lanka</p>
        </div>

        <div className="glass-card rounded-3xl p-8 space-y-6 border border-slate-100 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Delivery Zones & Fees</h3>
            <p>We deliver to all 25 districts in Sri Lanka. Our delivery fee structure:</p>
            <ul className="list-disc pl-5 space-y-1 font-semibold text-slate-800">
              <li>Colombo District: Rs. 300</li>
              <li>Gampaha & Kalutara Districts: Rs. 350</li>
              <li>All Other Sri Lankan Districts: Rs. 450 Flat Rate</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Delivery Timeframes</h3>
            <p>Orders placed before 2:00 PM are processed the same business day.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Colombo & Suburbs: 1 – 2 Business Days</li>
              <li>Western Province: 2 Business Days</li>
              <li>Outstation / Islandwide: 2 – 4 Business Days</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. Cash on Delivery (COD) Rules</h3>
            <p>
              Cash on Delivery is available islandwide. Please ensure an adult is available at the provided delivery address with exact cash to avoid courier redelivery delays.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
