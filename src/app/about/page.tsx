"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, Star, ShieldCheck, Facebook, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full space-y-16">
        {/* Hero */}
        <ScrollReveal variant="fade-up">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-miki-pink/10 text-miki-pink font-bold text-xs px-4 py-1.5 rounded-full inline-block">
              Our Brand Story
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
              Creating Magical Nursery Spaces for Sri Lankan Families
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              MIKI Baby SL was born out of a passion for beautiful nursery decor, charming framed wall art, and heartwarming baby shower gifts.
            </p>
          </div>
        </ScrollReveal>

        {/* Brand Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal variant="fade-up" delay={100}>
            <div className="glass-card rounded-3xl p-8 space-y-3 text-center border border-slate-100 h-full">
              <div className="w-14 h-14 bg-miki-lightPink text-miki-pink rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Childhood Artistry</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every safari animal print, birth stats plaque, and growth chart is crafted to stimulate warmth and imagination in your child's room.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={200}>
            <div className="glass-card rounded-3xl p-8 space-y-3 text-center border border-slate-100 h-full">
              <div className="w-14 h-14 bg-miki-lightYellow text-miki-yellow rounded-2xl flex items-center justify-center mx-auto">
                <Star className="w-7 h-7 fill-current text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">100% Recommendation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Trusted by thousands of parents across Sri Lanka on our official Facebook Page with verified 5-star feedback.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={300}>
            <div className="glass-card rounded-3xl p-8 space-y-3 text-center border border-slate-100 h-full">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Islandwide Reliability</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hassle-free Cash on Delivery across Colombo, Kandy, Galle, and all 25 Sri Lankan districts.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Social Presence Teaser */}
        <ScrollReveal variant="scale-up" delay={200}>
          <div className="glass-card rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-miki-lightPink via-miki-cream to-white border border-slate-100 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Join Our Facebook Community
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Stay updated with new wall art launches, customer nursery rooms, and promotional offers.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.facebook.com/share/1EB8C5CqVM/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-2"
              >
                <Facebook className="w-4 h-4 fill-current" /> Visit Official Facebook Page
              </a>

              <a
                href="https://wa.me/94767568100"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" /> WhatsApp 076 756 8100
              </a>
            </div>
          </div>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
