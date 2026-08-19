"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] transition-all animate-bounce">
      <div className="bg-miki-dark text-white text-sm font-medium px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-miki-pink/40">
        <span className="w-2.5 h-2.5 rounded-full bg-miki-pink animate-ping" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
