"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useCart } from "@/context/CartContext";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart } = useCart();
  const redirectUrl = searchParams.get("redirect") || (cart.length > 0 ? "/checkout" : "/account");

  const { register, customer } = useCustomerAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (customer) {
      router.push(redirectUrl);
    }
  }, [customer, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();

    if (!cleanName) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password: cleanPassword,
      });
      setIsLoading(false);

      if (result.success) {
        router.push(redirectUrl);
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-7 sm:p-9 space-y-6">
      {/* Top Sparkle Star Icon */}
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-amber-400 shadow-md hover:scale-105 transition-transform">
          <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400" />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Sign up once to log in seamlessly from any device, track your orders, and save your delivery details.
        </p>
      </div>

      {/* Inline Error Box */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 text-xs font-bold text-rose-600 text-center animate-in fade-in slide-in-from-top-1">
          {errorMessage}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            FULL NAME
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="John Doe"
              autoComplete="name"
              className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="you@example.com"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="email"
              spellCheck={false}
              className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            PHONE NUMBER
          </label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="077 123 4567"
              autoComplete="tel"
              className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            PASSWORD (MIN 6 CHARS)
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="••••••••"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="new-password"
              spellCheck={false}
              className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-2xl py-3.5 pl-11 pr-11 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 absolute right-4 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs tracking-wider uppercase py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-70 mt-2"
        >
          <span>{isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Bottom Footer Note */}
      <div className="pt-3 text-center border-t border-slate-100">
        <p className="text-xs text-slate-600 font-medium">
          Already have an account?{" "}
          <Link
            href={`/login${redirectUrl !== "/account" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-extrabold text-slate-900 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 py-12">
        <Suspense fallback={<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />}>
          <RegisterForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
