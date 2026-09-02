"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";
import { useStore } from "@/context/StoreContext";

function ShopContent() {
  const { products, categories } = useStore();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [priceSort, setPriceSort] = useState<string>("featured");
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (product.status !== "active") return false;

        // Category filter
        if (selectedCategory !== "all") {
          if (selectedCategory === "new-arrivals") {
            if (!product.isNewArrival) return false;
          } else if (selectedCategory === "offers") {
            if (!product.salePrice) return false;
          } else if (selectedCategory === "best-sellers") {
            if (!product.isFeatured) return false;
          } else {
            const matchedCat = categories.find((c) => c.slug === selectedCategory);
            if (matchedCat && product.categoryId !== matchedCat.categoryId) return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc) return false;
        }

        // Price filter
        const activePrice = product.salePrice || product.basePrice;
        if (activePrice > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.basePrice;
        const priceB = b.salePrice || b.basePrice;
        if (priceSort === "low-to-high") return priceA - priceB;
        if (priceSort === "high-to-low") return priceB - priceA;
        return 0;
      });
  }, [products, categories, selectedCategory, searchQuery, priceSort, maxPrice]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
      {/* Page Heading Banner */}
      <ScrollReveal variant="fade-up">
        <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FFF8F2] to-[#F4F7FF] p-6 sm:p-8 rounded-3xl border-2 border-pink-100/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-block bg-pink-100 text-rose-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-pink-200">
              MIKI Store Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              All Nursery Wall Art & Decor
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
              Browse our complete catalog of nursery framed prints, safari canvas sets, height charts, and personalized baby gifts.
            </p>
          </div>
          {/* Mobile Filter Toggle */}
          <button
            className="lg:hidden flex items-center gap-2 bg-white border-2 border-pink-200 text-slate-900 text-xs font-black px-4 py-2.5 rounded-xl shadow-xs shrink-0 hover:bg-rose-50 transition-colors"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="w-4 h-4 text-miki-pink" />
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>
      </ScrollReveal>

      {/* Filter Controls & Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters */}
        <div className={`lg:col-span-1 space-y-6 ${showFilters ? "block" : "hidden"} lg:block`}>
          <ScrollReveal variant="slide-left" delay={100}>
            <div className="rounded-3xl p-6 space-y-6 border-2 border-pink-100/90 bg-gradient-to-b from-white via-[#FFF9FA] to-[#FFF4F6] shadow-sm lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                <div className="flex items-center gap-2 font-black text-sm text-slate-900 font-heading">
                  <SlidersHorizontal className="w-4 h-4 text-miki-pink" />
                  <span>Filter Catalog</span>
                </div>
                <div className="flex items-center gap-2">
                  {(selectedCategory !== "all" || searchQuery || maxPrice < 6000) && (
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSearchQuery("");
                        setMaxPrice(6000);
                      }}
                      className="text-[11px] font-black text-rose-600 hover:text-pink-600 bg-rose-50 px-2 py-0.5 rounded-md border border-pink-200"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
                    onClick={() => setShowFilters(false)}
                    aria-label="Close filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Box */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 block">Search Products</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or style..."
                    className="w-full bg-white border-2 border-pink-100 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-miki-pink text-slate-800 placeholder-slate-400 font-medium"
                  />
                  <Search className="w-4 h-4 text-pink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Categories Filter */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 block">Categories</label>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                      selectedCategory === "all"
                        ? "bg-gradient-to-r from-miki-pink via-rose-500 to-miki-rose text-white shadow-sm shadow-pink-200"
                        : "text-slate-700 hover:bg-rose-50/80 bg-white/70 border border-pink-100/60"
                    }`}
                  >
                    All Products ({products.filter((p) => p.status === "active").length})
                  </button>

                  {categories.map((cat) => {
                    const count = products.filter(
                      (p) => p.categoryId === cat.categoryId && p.status === "active"
                    ).length;
                    const isSelected = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.categoryId}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-miki-pink via-rose-500 to-miki-rose text-white shadow-sm shadow-pink-200"
                            : "text-slate-700 hover:bg-rose-50/80 bg-white/70 border border-pink-100/60"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className={`text-[10px] ${isSelected ? "text-white/90" : "text-slate-400"}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2 pt-3 border-t border-pink-100">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-black text-slate-800">Max Budget</label>
                  <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-pink-100">
                    Rs. {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={6000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-miki-pink cursor-pointer"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Toolbar */}
          <ScrollReveal variant="fade-up" delay={150}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border-2 border-pink-100 bg-white shadow-2xs">
              <p className="text-xs font-bold text-slate-700">
                Showing <strong className="text-rose-600 font-black">{filteredProducts.length}</strong> creations
              </p>

              <div className="flex items-center gap-2 text-xs">
                <ArrowUpDown className="w-4 h-4 text-miki-pink" />
                <span className="font-black text-slate-800">Sort By:</span>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="bg-rose-50/60 border border-pink-200 text-slate-800 text-xs font-bold rounded-xl p-2 outline-none focus:ring-2 focus:ring-miki-pink cursor-pointer"
                >
                  <option value="featured">Featured / Best Sellers</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>
            </div>
          </ScrollReveal>

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <ScrollReveal variant="scale-up" delay={200}>
              <div className="rounded-3xl p-12 text-center space-y-4 border-2 border-pink-100 bg-gradient-to-b from-white to-[#FFF5F8]">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 shadow-xs">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 font-heading">No matching products found</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                  Try adjusting your search keywords or reset category filters to view more items.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setMaxPrice(6000);
                  }}
                  className="mt-3 bg-gradient-to-r from-miki-pink to-miki-rose text-white text-xs font-black px-7 py-3 rounded-full shadow-md shadow-pink-200 hover:from-rose-600 hover:to-pink-600 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product, idx) => (
                <ScrollReveal key={product.productId} variant="scale-up" delay={idx * 80} className="h-full">
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FFFBF7]">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-slate-600">Loading MIKI Catalog...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}
