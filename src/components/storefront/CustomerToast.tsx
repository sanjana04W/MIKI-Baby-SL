"use client";

import React, { useEffect, useState } from "react";
import { Check, AlertCircle, X } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export const CustomerToast: React.FC = () => {
  const { toast, hideToast } = useCustomerAuth();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const duration = 4000; // 4 seconds
    const intervalTime = 40;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          hideToast();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [toast, hideToast]);

  if (!toast || !toast.visible) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="fixed top-6 right-4 sm:right-8 z-[9999] max-w-md w-[calc(100vw-2rem)] sm:w-96 animate-in slide-in-from-top-4 fade-in duration-300">
      <div
        className={`relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
          isSuccess
            ? "bg-[#042820]/95 border-emerald-600/50 text-emerald-100"
            : "bg-[#28080c]/95 border-rose-600/50 text-rose-100"
        }`}
      >
        <div className="p-4 flex items-start gap-3.5">
          {/* Icon Badge */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
              isSuccess
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
            }`}
          >
            {isSuccess ? <Check className="w-5 h-5 stroke-[2.5]" /> : <AlertCircle className="w-5 h-5 stroke-[2.5]" />}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-xs font-black tracking-wider uppercase text-white font-heading">
              {toast.title}
            </h4>
            <p className="text-xs font-medium text-slate-200 mt-1 leading-relaxed">
              {toast.message}
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={hideToast}
            className="text-slate-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 cursor-pointer shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Countdown Progress Bar */}
        <div className="w-full h-1 bg-black/40">
          <div
            className={`h-full transition-all ease-linear ${
              isSuccess ? "bg-emerald-400" : "bg-rose-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
