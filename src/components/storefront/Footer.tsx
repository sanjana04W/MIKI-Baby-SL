"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  MessageCircle,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  Heart,
  Sparkles,
  MapPin,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-secondary text-white pt-16 pb-12 border-t-4 border-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-md border border-slate-700 bg-white flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="MIKI Baby SL Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                  MIKI <Sparkles className="w-4 h-4 text-brand-primary fill-brand-primary" />
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">
                  Baby SL • Wall Art & Gifts
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Adorable baby-room wall art, timeless newborn gifts, and artful treasures for Sri Lankan homes. Designed with love to create unforgettable childhood memories.
            </p>

            {/* Official Facebook Link */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/share/1EB8C5CqVM/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-md transition-transform hover:scale-110 flex items-center gap-2 text-xs font-semibold px-4"
              >
                <Facebook className="w-4 h-4 fill-current" />
                <span>Facebook Page</span>
              </a>

              <a
                href="https://wa.me/94767568100"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-full shadow-md transition-transform hover:scale-110 flex items-center gap-2 text-xs font-semibold px-4"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-primary pl-3">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/categories/wall-art" className="hover:text-brand-primary transition-colors">
                  Baby Room Wall Art
                </Link>
              </li>
              <li>
                <Link href="/categories/gifts" className="hover:text-brand-primary transition-colors">
                  Baby & Children's Gifts
                </Link>
              </li>
              <li>
                <Link href="/categories/nursery-decor" className="hover:text-brand-primary transition-colors">
                  Nursery & Home Treasures
                </Link>
              </li>
              <li>
                <Link href="/categories/new-arrivals" className="hover:text-brand-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/categories/offers" className="hover:text-brand-primary transition-colors font-semibold text-brand-primary">
                  Offers & Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-primary pl-3">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-brand-primary transition-colors">
                  About MIKI Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-primary transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-brand-primary transition-colors">
                  Islandwide Delivery Information
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-brand-primary transition-colors">
                  Exchange & Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-primary pl-3">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <span>076 756 8100</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>WhatsApp: 076 756 8100</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <span>mikibabysl@gmail.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <span>Colombo & Islandwide Delivery, Sri Lanka</span>
              </div>

              <div className="pt-2">
                <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-[11px] text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>100% Cash on Delivery (COD)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Miky Baby SL. All rights reserved. Designed for Sri Lankan families.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />
            <span>for little dreamers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
