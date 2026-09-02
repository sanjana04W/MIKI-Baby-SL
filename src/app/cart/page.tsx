"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    promoCode,
    discountAmount,
    applyPromoCode,
    removePromoCode,
  } = useCart();
  const { promotions } = useStore();

  const [inputCode, setInputCode] = useState("");
  const [promoError, setPromoError] = useState("");

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const clean = inputCode.trim().toUpperCase();

    const found = promotions.find((p) => p.code === clean && p.isActive);
    if (found) {
      let discount = 0;
      if (found.discountType === "percentage") {
        discount = Math.round((subtotal * found.discountValue) / 100);
      } else {
        discount = found.discountValue;
      }
      applyPromoCode(clean, discount);
      setInputCode("");
    } else {
      setPromoError("Invalid or expired promo code. Try MIKIBABY10!");
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Shopping Cart</h1>
              <p className="text-xs text-slate-500">Verify your items before proceeding to COD checkout</p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-miki-pink hover:text-miki-rose flex items-center gap-1 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </ScrollReveal>

        {cart.length === 0 ? (
          <ScrollReveal variant="scale-up">
            <div className="glass-card rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto">
              <div className="w-20 h-20 bg-miki-lightPink text-miki-pink rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Your shopping cart is empty</h2>
              <p className="text-xs text-slate-500">
                Browse our wall art collections or newborn gifts to add items to your cart!
              </p>
              <Link
                href="/shop"
                className="inline-block bg-miki-pink hover:bg-miki-rose text-white text-xs font-bold px-8 py-3 rounded-full shadow-lg"
              >
                Start Shopping
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item, idx) => (
                <ScrollReveal key={`${item.productId}-${item.variant || idx}`} variant="fade-up" delay={idx * 100}>
                  <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 border border-slate-100">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                      {item.variant && (
                        <p className="text-xs font-medium text-miki-pink">Option: {item.variant}</p>
                      )}
                      {item.dimensions && (
                        <p className="text-[11px] text-slate-400">Dimensions: {item.dimensions}</p>
                      )}
                      <p className="text-sm font-extrabold text-slate-900">{formatPrice(item.price)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.variant)
                          }
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1.5 font-extrabold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.variant)
                          }
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm sm:text-base font-black text-slate-900 text-right">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.productId, item.variant)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Order Summary & Promo */}
            <div className="lg:col-span-4 space-y-6">
              <ScrollReveal variant="slide-right" delay={150}>
                <div className="glass-card rounded-2xl p-5 space-y-3 border border-slate-100">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-miki-pink" /> Have a Promo Code?
                  </h3>

                  {promoCode ? (
                    <div className="flex items-center justify-between bg-miki-lightPink p-3 rounded-xl border border-miki-pink/30 text-xs">
                      <div>
                        <span className="font-bold text-miki-rose">{promoCode}</span>
                        <p className="text-[10px] text-slate-500">Discount of {formatPrice(discountAmount)} applied</p>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCode} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value)}
                          placeholder="Try MIKIBABY10"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-miki-pink"
                        />
                        <button
                          type="submit"
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && <p className="text-[11px] font-semibold text-rose-500">{promoError}</p>}
                    </form>
                  )}
                </div>
              </ScrollReveal>

              <ScrollReveal variant="slide-right" delay={250}>
                <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Summary
                  </h3>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-miki-rose font-bold">
                        <span>Promo Discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Fee (Sri Lanka)</span>
                      <span className="font-semibold text-slate-500">Calculated at Checkout</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-lg font-black text-slate-900">
                    <span>Estimated Total</span>
                    <span className="text-miki-rose">{formatPrice(finalTotal)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>100% Cash on Delivery (COD) in Sri Lanka</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full bg-miki-pink hover:bg-miki-rose text-white text-sm font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-center"
                  >
                    <span>Proceed to COD Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
