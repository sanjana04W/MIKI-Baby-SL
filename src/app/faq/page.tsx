"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";

export default function FAQPage() {
  const faqs = [
    {
      q: "How does Cash on Delivery (COD) work?",
      a: "Simply place your order on our website without entering card details. Our delivery partner will deliver the package to your address anywhere in Sri Lanka, and you pay cash to the courier rider upon delivery.",
    },
    {
      q: "What are the delivery fees across Sri Lanka?",
      a: "Colombo district delivery is Rs. 300, Gampaha and Kalutara districts are Rs. 350, and all other districts in Sri Lanka are Rs. 450 flat rate.",
    },
    {
      q: "How long does delivery take?",
      a: "Deliveries within Colombo & Western Province usually arrive in 1-2 business days. Outstation deliveries across Sri Lanka take 2-4 business days.",
    },
    {
      q: "Can I customize baby birth stats wall art?",
      a: "Yes! Select our 'Personalized Baby Name & Birth Stats Cloud Wall Art', and enter baby details (name, date, time, weight, height) in the order notes or send them directly to our WhatsApp (0767568100).",
    },
    {
      q: "Are the wall art frames fragile?",
      a: "We use eco-friendly pine wood frames with protective anti-shatter acrylic/glass and bubble wrap packaging to ensure safe delivery to your doorstep.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-12 w-full space-y-8">
        <ScrollReveal variant="fade-up">
          <div className="text-center space-y-2">
            <HelpCircle className="w-10 h-10 text-miki-pink mx-auto" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h1>
            <p className="text-xs text-slate-500">Everything you need to know about ordering from MIKI Baby SL</p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} variant="fade-up" delay={i * 100}>
              <div className="glass-card rounded-2xl p-6 border border-slate-100 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-miki-pink/20 text-miki-pink text-xs font-bold flex items-center justify-center shrink-0">
                    Q
                  </span>
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 pl-8 leading-relaxed">{faq.a}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
