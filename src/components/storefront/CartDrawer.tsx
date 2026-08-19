"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal } = useCart();
  const toggleCart = () => setIsCartOpen(false);

  const navigateTo = (path: string) => {
    setIsCartOpen(false);
    router.push(path);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={toggleCart}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity cursor-pointer"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-miki-cream">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-miki-pink" />
              <h2 className="text-base font-bold text-slate-800">Your Shopping Cart</h2>
              <span className="text-xs bg-miki-pink/20 text-miki-rose font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-miki-lightPink text-miki-pink rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Your cart is empty</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore our nursery wall art sets and baby gifts to fill your cart.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo("/shop")}
                  className="inline-block bg-miki-pink hover:bg-miki-rose text-white text-xs font-bold px-8 py-3 rounded-full shadow hover:shadow-md transition-all cursor-pointer active:scale-95"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.variant || idx}`}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50/50"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200 flex items-center justify-center p-1">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                    {item.variant && (
                      <p className="text-[10px] text-miki-pink font-semibold">{item.variant}</p>
                    )}
                    <p className="text-xs font-extrabold text-slate-900">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.variant)
                          }
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.variant)
                          }
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.variant)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-white space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">Subtotal</span>
                <span className="text-lg font-black text-slate-900">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>100% Cash on Delivery across Sri Lanka</span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => navigateTo("/checkout")}
                  className="w-full bg-miki-pink hover:bg-miki-rose text-white text-xs font-bold py-3 rounded-xl shadow flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Proceed to COD Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo("/cart")}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                >
                  View Full Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
