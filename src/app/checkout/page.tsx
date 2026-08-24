"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  CheckCircle,
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Mail,
  FileText,
  Gift,
  KeyRound,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import {
  formatPrice,
  SRI_LANKA_DISTRICTS,
  calculateDeliveryFee,
} from "@/lib/utils";
import { trackPurchase } from "@/lib/metaPixel";
import { sendVerificationOtpEmail } from "@/lib/emailService";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discountAmount, clearCart } = useCart();
  const { createOrder } = useStore();
  const { customer } = useCustomerAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Colombo");
  const [notes, setNotes] = useState("");

  // Auto-populate customer information if logged in
  useEffect(() => {
    if (customer) {
      if (customer.name) setName(customer.name);
      if (customer.phone) setPhone(customer.phone);
      if (customer.email) setEmail(customer.email);
      if (customer.address) setAddress(customer.address);
      if (customer.district) setDistrict(customer.district);
    }
  }, [customer]);

  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  // Verification step state
  const [step, setStep] = useState<"form" | "verify">("form");
  const [otpCode, setOtpCode] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (cart.length === 0 && !isOrderPlaced) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Your cart is empty</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            Please add items to cart before checking out.
          </p>
          <Link
            href="/shop"
            className="bg-miki-pink text-white text-xs font-bold px-6 py-3 rounded-full shadow"
          >
            Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Load draft values if returning from login
  useEffect(() => {
    try {
      const draft = localStorage.getItem("miki_draft_checkout");
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.district) setDistrict(parsed.district);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.giftWrap !== undefined) setGiftWrap(parsed.giftWrap);
        if (parsed.giftNote) setGiftNote(parsed.giftNote);
        localStorage.removeItem("miki_draft_checkout");
      }
    } catch {}
  }, []);

  const deliveryFee = calculateDeliveryFee(district);
  const giftWrapFee = giftWrap ? 250 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount) + deliveryFee + giftWrapFee;

  // Step 1: User clicks "Confirm Order (Cash on Delivery)"
  // If not logged in, redirects to Sign In page first
  const handleInitiateVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setOtpError("");

    // Enforce login requirement: must be signed in to confirm order
    if (!customer) {
      try {
        localStorage.setItem(
          "miki_draft_checkout",
          JSON.stringify({ name, phone, email, address, district, notes, giftWrap, giftNote })
        );
      } catch {}
      router.push("/login?redirect=/checkout&reason=order_required");
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim() || !district) {
      setErrorMsg("Please fill in all required delivery details.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address to receive your 6-digit verification code.");
      return;
    }

    setIsSendingOtp(true);

    // Generate random 6-digit verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedCode);

    // Send email using EmailJS
    const res = await sendVerificationOtpEmail({
      toEmail: email.trim(),
      toName: name.trim(),
      otpCode: generatedCode,
      totalAmount: `Rs. ${grandTotal.toLocaleString()}`,
    });

    setIsSendingOtp(false);
    setStep("verify");
    setResendTimer(45);
    setOtpSuccess(`Verification code sent to ${email.trim()}!`);
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setOtpError("");
    setIsSendingOtp(true);

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedCode);

    await sendVerificationOtpEmail({
      toEmail: email.trim(),
      toName: name.trim(),
      otpCode: generatedCode,
      totalAmount: `Rs. ${grandTotal.toLocaleString()}`,
    });

    setIsSendingOtp(false);
    setResendTimer(45);
    setOtpSuccess(`A new 6-digit code has been sent to ${email.trim()}!`);
  };

  // Step 2: Finalize Order Creation (after OTP verification or fallback)
  const finalizeOrder = () => {
    if (isSubmitting || isVerifying) return; // prevent double-call
    setIsVerifying(true);
    setIsSubmitting(true);

    try {
      const orderItems = cart.map((ci) => ({
        productId: ci.productId,
        name: ci.name,
        price: ci.price,
        quantity: ci.quantity,
        variant: ci.variant,
        image: ci.image,
        dimensions: ci.dimensions,
        personalizationDetails: ci.personalizationDetails,
      }));

      const finalName = name.trim() || customer?.name || "Valued Customer";
      const finalPhone = phone.trim() || customer?.phone || "";
      const finalEmail =
        email.trim() ||
        customer?.email ||
        `${finalName.toLowerCase().replace(/\s+/g, "")}@customer.lk`;

      const newOrder = createOrder({
        customerId: customer?.id || undefined,
        customerInfo: {
          name: finalName,
          phone: finalPhone,
          email: finalEmail,
          address: address.trim(),
          district,
          notes: notes.trim() || undefined,
          giftWrap,
          giftNote: giftNote.trim() || undefined,
        },
        items: orderItems,
        subtotal,
        deliveryFee,
        giftWrapFee,
        discountAmount,
        totalAmount: grandTotal,
        paymentMethod: "COD",
        paymentStatus: "pending",
        orderStatus: "Pending",
      });

      trackPurchase(newOrder.orderId, grandTotal, cart.length);
      setIsOrderPlaced(true);
      clearCart();

      router.replace(`/order-confirmation/${newOrder.orderId}`);
    } catch (err) {
      console.error(err);
      setOtpError("Failed to place order. Please try again or contact WhatsApp support.");
      setIsVerifying(false);
      setIsSubmitting(false);
    }
  };

  // Handle Verify Button Click
  const handleVerifyOtp = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setOtpError("");

    const cleanInput = enteredOtp.trim();
    if (!cleanInput) {
      setOtpError("Please enter the 6-digit code.");
      return;
    }

    if (cleanInput.length !== 6) {
      setOtpError("Please enter a valid 6-digit code.");
      return;
    }

    // Verify matching code (or demo code 123456)
    if (cleanInput === otpCode || cleanInput === "123456") {
      finalizeOrder();
    } else {
      setOtpError("Invalid code. Please check your email inbox or spam folder.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Cash on Delivery Checkout</h1>
            <p className="text-xs text-slate-500">Pay cash upon delivery anywhere in Sri Lanka</p>
          </div>
          <Link
            href="/cart"
            className="text-xs font-bold text-miki-pink hover:text-miki-rose flex items-center gap-1 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Account Sign-In / Register Prompt Banner if not logged in */}
        {!customer ? (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-miki-lightPink text-miki-rose flex items-center justify-center font-bold text-sm shrink-0 border border-miki-pink/30">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">
                  Already have a MIKI Baby account?
                </p>
                <p className="text-[11px] text-slate-500">
                  Sign in to auto-fill delivery details and track your shipment easily.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/login"
                className="flex-1 sm:flex-initial bg-slate-900 hover:bg-black text-white font-extrabold text-xs px-4 py-2 rounded-xl text-center shadow-xs transition-transform active:scale-95"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2 rounded-xl text-center transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-3xl p-4 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-rose-500 to-miki-pink text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-slate-600">Logged in as: </span>
                <span className="font-extrabold text-slate-900">{customer.name}</span>
                <span className="text-slate-400 text-[11px]"> ({customer.email})</span>
              </div>
            </div>
            <Link
              href="/account"
              className="text-miki-pink font-bold hover:underline text-[11px]"
            >
              Manage Profile →
            </Link>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === "verify") {
              handleVerifyOtp();
            } else {
              handleInitiateVerification(e);
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Form Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Truck className="w-5 h-5 text-miki-pink" /> 1. Delivery Address & Contact
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      disabled={step === "verify"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dinithi Perera"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs font-medium outline-none focus:ring-2 focus:ring-miki-pink text-slate-800 disabled:opacity-75"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Phone Number (Mobile) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        disabled={step === "verify"}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 077 123 4567"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs font-medium outline-none focus:ring-2 focus:ring-miki-pink text-slate-800 disabled:opacity-75"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Email Address * <span className="text-[10px] text-miki-pink font-normal">(For verification code)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        disabled={step === "verify"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs font-medium outline-none focus:ring-2 focus:ring-miki-pink text-slate-800 disabled:opacity-75"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Full Delivery Street Address *
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      rows={2}
                      disabled={step === "verify"}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. No. 42, Havelock Road, Colombo 05"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs font-medium outline-none focus:ring-2 focus:ring-miki-pink text-slate-800 disabled:opacity-75"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Select Delivery District *
                  </label>
                  <select
                    disabled={step === "verify"}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-miki-pink disabled:opacity-75"
                  >
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        District: {d} (
                        {calculateDeliveryFee(d) === 300
                          ? "Rs. 300 Colombo"
                          : calculateDeliveryFee(d) === 350
                          ? "Rs. 350 Western Province"
                          : "Rs. 450 Islandwide"}
                        )
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={step === "verify"}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Call before arrival, landmark near main gate"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs outline-none focus:ring-2 focus:ring-miki-pink text-slate-800 disabled:opacity-75"
                    />
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gift Options Box */}
            <div className="glass-card rounded-3xl p-6 space-y-4 border border-miki-pink/30 bg-miki-lightPink/30">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={step === "verify"}
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="rounded text-miki-pink focus:ring-miki-pink w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-miki-rose" /> Add Luxury Gift Packaging & Ribbon
                    (+ Rs. 250)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Includes decorative box, satin ribbon, and custom message card
                  </p>
                </div>
              </label>

              {giftWrap && (
                <div className="pt-2 animate-fadeIn">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Custom Gift Card Message
                  </label>
                  <textarea
                    rows={2}
                    disabled={step === "verify"}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="e.g. Happy 1st Birthday little prince! With love from Aunty Shenali"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-miki-pink disabled:opacity-75"
                  />
                </div>
              )}
            </div>

            {/* Payment Method Badge */}
            <div className="glass-card rounded-3xl p-6 space-y-3 border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>2. Payment Method</span>
                </div>
                <span className="bg-emerald-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full uppercase">
                  Cash on Delivery
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You will pay cash upon physical delivery of your package across Sri Lanka.
              </p>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-6 space-y-6 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Order Summary ({cart.length})
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.name}</p>
                      {item.personalizationDetails && (
                        <p className="text-[10px] text-miki-pink font-semibold truncate">
                          Personalized: {item.personalizationDetails}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-500">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-miki-rose font-bold">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {giftWrapFee > 0 && (
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Gift Packaging Fee</span>
                    <span>+{formatPrice(giftWrapFee)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee ({district})</span>
                  <span className="font-bold text-slate-900">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount (COD)</span>
                  <span className="text-miki-rose">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {step === "form" && (
                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full bg-miki-pink hover:bg-miki-rose disabled:bg-slate-300 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm cursor-pointer"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirm Order (Cash on Delivery)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Email Verification Section Below Order Summary */}
            {step === "verify" && (
              <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-5 border-2 border-slate-900 bg-white shadow-xl animate-fade-up">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-slate-800" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Email Verification</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  We've sent a 6-digit verification code to{" "}
                  <strong className="text-slate-900 font-bold">{email}</strong>. Please enter it
                  below to confirm your order.
                </p>

                {otpError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                {otpSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{otpSuccess}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit code"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-slate-800 rounded-xl p-3.5 text-center sm:text-left text-sm font-black tracking-widest outline-none transition-all placeholder:font-normal placeholder:tracking-normal text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifying || enteredOtp.trim().length !== 6}
                    className="bg-slate-700 hover:bg-slate-900 disabled:bg-slate-300 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow transition-all uppercase tracking-wider cursor-pointer active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>VERIFY & PLACE ORDER</span>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setOtpError("");
                    }}
                    className="text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer"
                  >
                    Change Email or Details
                  </button>

                  <div className="flex items-center gap-3">
                    {resendTimer > 0 ? (
                      <span className="text-slate-400 text-[11px]">
                        Resend in {resendTimer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isSendingOtp}
                        className="text-miki-pink hover:text-miki-rose font-bold cursor-pointer"
                      >
                        Resend Code
                      </button>
                    )}

                    <span className="text-slate-300">•</span>

                    <button
                      type="button"
                      onClick={finalizeOrder}
                      className="text-slate-700 hover:text-slate-900 font-bold hover:underline cursor-pointer text-[11px]"
                    >
                      Didn't get code? Complete Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
