"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Flame, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const isOrderRequired = searchParams.get("reason") === "order_required";

  const { login, customer } = useCustomerAuth();

  const [email, setEmail] = useState("");
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

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      setIsLoading(false);

      if (result.success) {
        // Redirect to intended destination (e.g. /checkout or /account)
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
      {/* Top Flame/Sparkle Icon (Matching Screenshot) */}
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-rose-500 shadow-md hover:scale-105 transition-transform">
          <Flame className="w-6 h-6 fill-rose-500 text-rose-500" />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
          Welcome Back!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Log in to track orders, manage your profile, and checkout faster.
        </p>
      </div>

      {/* Order Required Notice Banner */}
      {isOrderRequired && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 text-xs font-bold text-amber-800 flex items-center gap-2.5 animate-in fade-in">
          <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Please sign in to confirm and complete your order.</span>
        </div>
      )}

      {/* Inline Error Box (Matching Screenshot 5) */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 text-xs font-bold text-rose-600 text-center animate-in fade-in slide-in-from-top-1 space-y-2">
          <p>{errorMessage}</p>
          {errorMessage.includes("create an account") && (
            <div className="pt-1">
              <Link
                href={`/register${redirectUrl !== "/account" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[11px] uppercase tracking-wider py-2 px-4 rounded-xl shadow-xs transition-transform active:scale-95"
              >
                Create an Account with Order →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              PASSWORD
            </label>
            <button
              type="button"
              onClick={() => alert("Password reset link has been sent to your email (Demo).")}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="••••••••"
              className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-2xl py-3.5 pl-11 pr-11 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 absolute right-4 top-1/2 -translate-y-1/2 p-1"
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
          <span>{isLoading ? "SIGNING IN..." : "SIGN IN"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Bottom Footer Note */}
      <div className="pt-4 text-center space-y-2 border-t border-slate-100">
        <p className="text-xs text-slate-600 font-medium">
          New to MIKI Baby SL?{" "}
          <Link
            href={`/register${redirectUrl !== "/account" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-extrabold text-slate-900 hover:underline"
          >
            Create an Account
          </Link>
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed flex items-center justify-center gap-1">
          <span>🔒</span> Register once to log in seamlessly with your email & password across all devices.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 py-12">
        <Suspense fallback={<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />}>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
