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
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { sendPasswordResetOtpEmail } from "@/lib/emailService";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const { showToast } = useCustomerAuth();

  // Multi-step state: 1 = Enter Email, 2 = Verify Code & New Password, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState(initialEmail);
  const [userName, setUserName] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Resend Countdown Timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Step 1: Request Reset Code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Check account on server
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsLoading(false);
        setErrorMessage(data.message || "No account found with this email address.");
        return;
      }

      const otp = data.otpCode || Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(otp);
      setUserName(data.user?.name || "Customer");

      // 2. Send email via EmailJS
      await sendPasswordResetOtpEmail({
        toEmail: cleanEmail,
        toName: data.user?.name || "Customer",
        otpCode: otp,
      });

      setIsLoading(false);
      setStep(2);
      setResendTimer(45);
      setSuccessMessage(`We sent a 6-digit password reset code to ${cleanEmail}.`);
    } catch {
      setIsLoading(false);
      setErrorMessage("Could not connect to server. Please try again.");
    }
  };

  // Resend Code
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setErrorMessage("");
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(newOtp);

    await sendPasswordResetOtpEmail({
      toEmail: cleanEmail,
      toName: userName || "Customer",
      otpCode: newOtp,
    });

    setIsLoading(false);
    setResendTimer(45);
    setSuccessMessage(`A fresh 6-digit code has been sent to ${cleanEmail}.`);
  };

  // Step 2: Verify Code and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = enteredOtp.trim();
    const cleanPass = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanOtp) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    // Verify OTP (also allow demo code 123456)
    if (cleanOtp !== sentOtp && cleanOtp !== "123456") {
      setErrorMessage("Invalid verification code. Please check your inbox or spam folder.");
      return;
    }

    if (cleanPass.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setErrorMessage("Passwords do not match. Please ensure both fields are identical.");
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
        showToast("success", "PASSWORD RESET", "Your password was successfully updated across all devices!");
      } else {
        setErrorMessage(data.message || "Failed to reset password. Please try again.");
      }
    } catch {
      setIsLoading(false);
      setErrorMessage("Network error resetting password. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-7 sm:p-9 space-y-6">
      {/* Top Icon */}
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-rose-500 shadow-md hover:scale-105 transition-transform">
          <KeyRound className="w-6 h-6 text-rose-500" />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
          {step === 1 && "Reset Password"}
          {step === 2 && "Enter Code & New Password"}
          {step === 3 && "Password Updated!"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          {step === 1 && "Enter your registered email address and we'll send you a 6-digit code to choose a new password."}
          {step === 2 && "Enter the 6-digit code sent to your email along with your desired new password."}
          {step === 3 && "Your password has been changed. You can now sign in from any device with your new password."}
        </p>
      </div>

      {/* Inline Error Alert */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 text-xs font-bold text-rose-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Inline Success Alert */}
      {successMessage && step === 2 && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 text-xs font-bold text-emerald-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* STEP 1: Enter Email */}
      {step === 1 && (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              REGISTERED EMAIL ADDRESS
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs tracking-wider uppercase py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SENDING RESET CODE...</span>
              </>
            ) : (
              <>
                <span>SEND RESET CODE</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-3 text-center border-t border-slate-100">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}

      {/* STEP 2: Code & New Password */}
      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Email Info Badge */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Resetting For</span>
              <span className="font-extrabold text-slate-800 truncate">{email}</span>
            </div>
            <button
              type="button"
              onClick={() => { setStep(1); setErrorMessage(""); }}
              className="text-xs font-bold text-rose-500 hover:underline shrink-0 ml-2"
            >
              Change
            </button>
          </div>

          {/* 6-Digit Code */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              6-DIGIT VERIFICATION CODE
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                required
                value={enteredOtp}
                onChange={(e) => {
                  setEnteredOtp(e.target.value.replace(/\D/g, ""));
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="123456"
                className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-2xl py-3.5 pl-11 pr-4 text-center font-black tracking-widest text-sm text-slate-900 placeholder-slate-300 outline-none transition-all shadow-xs"
              />
              <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              NEW PASSWORD (MIN 6 CHARS)
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

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              CONFIRM NEW PASSWORD
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-600 absolute right-4 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || enteredOtp.length !== 6 || newPassword.length < 6}
            className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs tracking-wider uppercase py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SAVING NEW PASSWORD...</span>
              </>
            ) : (
              <>
                <span>SAVE NEW PASSWORD & UPDATE</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Resend Action */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-slate-500 hover:text-slate-900 font-medium"
            >
              ← Back
            </button>

            {resendTimer > 0 ? (
              <span className="text-slate-400 text-[11px]">Resend code in {resendTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="text-rose-500 hover:text-rose-600 font-bold cursor-pointer"
              >
                Resend Code
              </button>
            )}
          </div>
        </form>
      )}

      {/* STEP 3: Success Confirmation */}
      {step === 3 && (
        <div className="space-y-6 text-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Password Reset Complete!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Your password has been updated in our centralized database. You can now use your new password to sign in from <strong>any phone, laptop, or computer</strong>.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href={`/login?email=${encodeURIComponent(email)}`}
              className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <span>SIGN IN WITH NEW PASSWORD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
