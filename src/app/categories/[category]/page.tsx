"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useStore } from "@/context/StoreContext";

export default function CategoryBrowsePage() {
  const params = useParams();
  const catSlug = params?.category as string;

  const { products, categories } = useStore();

  const currentCategory = categories.find((c) => c.slug === catSlug);

  const filteredProducts = products.filter((p) => {
    if (p.status !== "active") return false;
    if (catSlug === "new-arrivals") return p.isNewArrival;
    if (catSlug === "best-sellers") return p.isFeatured;
    if (catSlug === "offers") return !!p.salePrice;
    if (currentCategory) return p.categoryId === currentCategory.categoryId;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        <div className="glass-card rounded-3xl p-8 bg-gradient-to-r from-miki-lightPink via-miki-cream to-white border border-slate-100 space-y-2">
          <h1 className="text-3xl font-black text-slate-900 capitalize">
            {currentCategory ? currentCategory.name : catSlug.replace("-", " ")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            {currentCategory?.description ||
              "Explore adorable baby room wall art, gift sets, and nursery treasures handcrafted in Sri Lanka."}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center space-y-3">
            <h3 className="text-lg font-bold text-slate-800">No items available in this category</h3>
            <p className="text-xs text-slate-500">Check back soon for new arrivals!</p>
            <Link
              href="/shop"
              className="inline-block mt-3 bg-miki-pink text-white text-xs font-bold px-6 py-2.5 rounded-full"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
