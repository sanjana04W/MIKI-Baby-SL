"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

export default function WishlistPage() {
  const { wishlist } = useCart();
  const { products } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.productId));

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-miki-rose fill-miki-rose" /> Saved Wishlist
            </h1>
            <p className="text-xs text-slate-500">Your favorite nursery wall art & gift items</p>
          </div>
          <Link href="/shop" className="text-xs font-bold text-miki-pink hover:text-miki-rose flex items-center gap-1 shrink-0">
            <ArrowLeft className="w-4 h-4" /> Continue Browsing
          </Link>
        </div>

        {savedProducts.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-20 h-20 bg-miki-lightPink text-miki-rose rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Your wishlist is currently empty</h2>
            <p className="text-xs text-slate-500">
              Tap the heart icon on any wall art piece or gift item to save it here for later!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-miki-pink hover:bg-miki-rose text-white text-xs font-bold px-8 py-3 rounded-full shadow-lg"
            >
              Explore Nursery Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {savedProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
