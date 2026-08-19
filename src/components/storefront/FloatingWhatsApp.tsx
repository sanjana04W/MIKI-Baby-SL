"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { generateWhatsAppDirectInquiry } from "@/lib/utils";

export const FloatingWhatsApp: React.FC = () => {
  const pathname = usePathname();

  // Hide WhatsApp bubble on all admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const whatsappUrl = generateWhatsAppDirectInquiry();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-3 rounded-full shadow-xl transition-all hover:scale-105 group pulse-glow"
    >
      <MessageCircle className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline text-sm font-semibold">Chat with MIKI</span>
    </a>
  );
};
