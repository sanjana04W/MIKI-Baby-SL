"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { OrderItem } from "@/types";

interface CartItem extends OrderItem {}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (productId: string, variant?: string, personalizationDetails?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string, personalizationDetails?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  promoCode: string;
  discountAmount: number;
  applyPromoCode: (code: string, discount: number) => void;
  removePromoCode: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  wishlist: string[]; // array of productIds
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cart & wishlist with localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("miki_cart");
      const savedWishlist = localStorage.getItem("miki_wishlist");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("miki_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("miki_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const addToCart = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qty = item.quantity || 1;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.productId === item.productId &&
          ci.variant === item.variant &&
          ci.personalizationDetails === item.personalizationDetails
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [...prev, { ...item, quantity: qty }];
      }
    });

    showToast(`Added "${item.name}" to cart! 🛒`);
  };

  const removeFromCart = (
    productId: string,
    variant?: string,
    personalizationDetails?: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (ci) =>
          !(
            ci.productId === productId &&
            ci.variant === variant &&
            ci.personalizationDetails === personalizationDetails
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    variant?: string,
    personalizationDetails?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant, personalizationDetails);
      return;
    }
    setCart((prev) =>
      prev.map((ci) =>
        ci.productId === productId &&
        ci.variant === variant &&
        ci.personalizationDetails === personalizationDetails
          ? { ...ci, quantity }
          : ci
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode("");
    setDiscountAmount(0);
  };

  const applyPromoCode = (code: string, discount: number) => {
    setPromoCode(code);
    setDiscountAmount(discount);
    showToast(`Promo code "${code}" applied! 🎉`);
  };

  const removePromoCode = () => {
    setPromoCode("");
    setDiscountAmount(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from Wishlist 💔");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to Wishlist! ❤️");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        promoCode,
        discountAmount,
        applyPromoCode,
        removePromoCode,
        toastMessage,
        showToast,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
