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
      {/* Page Heading */}
      <ScrollReveal variant="fade-up">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">All Products & Wall Art</h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Browse our complete catalog of nursery framed prints, canvas art sets, height growth charts, and baby shower gift boxes.
            </p>
          </div>
          {/* Mobile Filter Toggle */}
          <button
            className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shrink-0 hover:bg-slate-50 transition-colors"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="w-4 h-4 text-miki-pink" />
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>
      </ScrollReveal>

      {/* Filter Controls & Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters - hidden on mobile by default, shown when toggled */}
        <div className={`lg:col-span-1 space-y-6 ${showFilters ? "block" : "hidden"} lg:block`}>
          <ScrollReveal variant="slide-left" delay={100}>
            <div className="glass-card rounded-2xl p-5 space-y-6 border border-slate-100 lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
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
                      className="text-[11px] font-bold text-miki-rose hover:underline"
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
                <label className="text-xs font-bold text-slate-700 block">Search Products</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-miki-pink"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Categories Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Categories</label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition-colors ${
                      selectedCategory === "all"
                        ? "bg-miki-pink text-white font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    All Products ({products.filter((p) => p.status === "active").length})
                  </button>

                  {categories.map((cat) => {
                    const count = products.filter(
                      (p) => p.categoryId === cat.categoryId && p.status === "active"
                    ).length;
                    return (
                      <button
                        key={cat.categoryId}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center justify-between transition-colors ${
                          selectedCategory === cat.slug
                            ? "bg-miki-pink text-white font-bold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700">Max Price</label>
                  <span className="font-extrabold text-miki-rose">Rs. {maxPrice}</span>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-600">
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> products
              </p>

              <div className="flex items-center gap-2 text-xs">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700">Sort By:</span>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2 outline-none focus:ring-2 focus:ring-miki-pink"
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
              <div className="glass-card rounded-3xl p-12 text-center space-y-3">
                <div className="w-16 h-16 bg-miki-lightPink text-miki-pink rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No matching products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search query or reset category filters to view more items.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setMaxPrice(6000);
                  }}
                  className="mt-3 bg-miki-pink hover:bg-miki-rose text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product, idx) => (
                <ScrollReveal key={product.productId} variant="scale-up" delay={idx * 100} className="h-full">
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
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-xs font-bold">Loading MIKI Catalog...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}
