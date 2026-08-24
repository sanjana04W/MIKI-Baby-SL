"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const { showToast } = useCustomerAuth();

  // Multi-step state: 1 = Verify Email, 2 = Set New Password, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Step 1: Verify Email
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      // Check if account exists on centralized database
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "No account found with this email. Please check your spelling or register a new account.");
        return;
      }

      // Transition to Step 2
      setStep(2);
    } catch {
      setIsLoading(false);
      setErrorMessage("Could not connect to server. Please try again.");
    }
  };

  // Step 2: Set New Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanPass) {
      setErrorMessage("Please enter your new password.");
      return;
    }

    if (cleanPass.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setErrorMessage("Passwords do not match. Please re-enter identical passwords.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          newPassword: cleanPass,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success) {
        setStep(3);
        showToast("success", "PASSWORD UPDATED", "Your password was updated! You can now sign in from any device.");
      } else {
        setErrorMessage(data.message || "Failed to update password. Please try again.");
      }
    } catch {
      setIsLoading(false);
      setErrorMessage("Network error updating password. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Graphic Icon */}
      <div className="flex justify-center">
        {step === 1 && (
          <div className="text-4xl select-none animate-bounce duration-1000">
            <span role="img" aria-label="lock">🔐</span>
          </div>
        )}
        {step === 2 && (
          <div className="text-4xl select-none animate-bounce duration-1000">
            <span role="img" aria-label="key">🔑</span>
          </div>
        )}
        {step === 3 && (
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Heading & Subtitle */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight font-heading">
          {step === 1 && "Forgot Password?"}
          {step === 2 && "Set New Password"}
          {step === 3 && "Password Updated!"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          {step === 1 && "Enter your registered email address to continue."}
          {step === 2 && (
            <span>
              Creating password for{" "}
              <strong className="text-purple-600 font-bold break-all">{email}</strong>
            </span>
          )}
          {step === 3 && "Your password has been changed successfully. You can now use it to log in from any phone, laptop, or computer."}
        </p>
      </div>

      {/* Step Progress Bar (Step 1 & 2 only) */}
      {step !== 3 && (
        <div className="space-y-3 pt-1">
          {/* Dual Segment Progress Bars */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {/* Segment 1: Always Active (Rose/Pink) */}
            <div className="h-1.5 rounded-full bg-rose-500 transition-all duration-300" />
            {/* Segment 2: Inactive in Step 1 (Gray), Active in Step 2 (Purple) */}
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 2 ? "bg-purple-500" : "bg-slate-200"
              }`}
            />
          </div>

          {/* Step Indicator Label */}
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">
            {step === 1 ? "STEP 1 OF 2 — VERIFY EMAIL" : "STEP 2 OF 2 — NEW PASSWORD"}
          </p>
        </div>
      )}

      {/* Inline Error Box */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 text-xs font-bold text-rose-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Verify Email Form */}
      {step === 1 && (
        <form onSubmit={handleVerifyEmail} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5 text-left">
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
                className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
              />
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Continue Gradient Button */}
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white font-black text-sm tracking-wide py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking Account...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Back to Login Link */}
          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}

      {/* STEP 2: Set New Password Form */}
      {step === 2 && (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {/* New Password */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              NEW PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Min. 6 characters"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="new-password"
                spellCheck={false}
                className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 rounded-2xl py-3.5 pl-11 pr-11 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Re-enter your password"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="new-password"
                spellCheck={false}
                className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 rounded-2xl py-3.5 pl-11 pr-11 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Update Password Gradient Button */}
          <button
            type="submit"
            disabled={isLoading || newPassword.length < 6 || !confirmPassword}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white font-black text-sm tracking-wide py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Change Email Link */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setErrorMessage("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Email</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Success Screen */}
      {step === 3 && (
        <div className="space-y-6 text-center animate-in fade-in duration-300">
          <div className="pt-2">
            <Link
              href={`/login?email=${encodeURIComponent(email)}`}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white font-black text-sm tracking-wide py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-transform active:scale-95"
            >
              <span>Sign In Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-slate-400">
              🔒 Works across all devices (phones, laptops, and tablets)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 py-12">
        <Suspense fallback={<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />}>
          <ForgotPasswordForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
