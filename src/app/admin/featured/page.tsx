"use client";

import React, { useState } from "react";
import {
  Star,
  Search,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { logAdminAction } from "@/lib/auditDb";

export default function FeaturedProductsPage() {
  const { adminUser, hasPermission } = useAdminAuth();
  const { products, updateProduct, categories } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  if (!adminUser) return null;
  if (!hasPermission("products")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="p-10 text-rose-400 font-bold">
            Access Denied: You do not have permission to manage featured products.
          </div>
        </div>
      </div>
    );
  }

  const featuredProducts = products.filter((p) => p.isFeatured);
  const nonFeaturedProducts = products.filter((p) => {
    if (p.isFeatured) return false;
    if (!searchQuery.trim()) return true;
    return p.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getCatName = (catId: string) =>
    categories.find((c) => c.categoryId === catId)?.name || catId;

  const toggleFeatured = (productId: string, featured: boolean) => {
    updateProduct(productId, { isFeatured: featured });
    const prod = products.find((p) => p.productId === productId);
    if (adminUser && prod) {
      logAdminAction({
        action: "FEATURED_TOGGLED",
        adminName: adminUser.name,
        adminEmail: adminUser.email,
        adminRole: adminUser.role,
        targetType: "product",
        targetId: productId,
        targetName: prod.name,
        details: `${featured ? "Added" : "Removed"} "${prod.name}" ${featured ? "to" : "from"} homepage featured selection.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-10 space-y-6 overflow-y-auto w-full max-w-full min-w-0 max-h-[calc(100vh-61px)]">
          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" /> Featured
              Products
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select which products appear in the Featured section on the homepage.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{featuredProducts.length}</div>
                <p className="text-[11px] text-slate-500 font-semibold">Currently Featured</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-sky-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{products.length}</div>
                <p className="text-[11px] text-slate-500 font-semibold">Total Products Available</p>
              </div>
            </div>
          </div>

          {/* ── Currently Featured ── */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              ⭐ Currently Featured ({featuredProducts.length})
            </h2>
            {featuredProducts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                No featured products. Add some from the list below.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredProducts.map((p) => (
                  <div
                    key={p.productId}
                    className="rounded-2xl bg-white border border-amber-100 shadow-sm overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={p.images[0] || "/images/placeholder.jpg"}
                        alt={p.name}
                        className="w-full h-32 object-cover bg-slate-100"
                      />
                      <span className="absolute top-2 right-2 bg-amber-400 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                        FEATURED
                      </span>
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="font-bold text-slate-900 text-xs line-clamp-2">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{getCatName(p.categoryId)}</p>
                      <p className="text-sm font-black text-miki-pink">
                        {formatPrice(p.salePrice || p.basePrice)}
                      </p>
                      <button
                        onClick={() => toggleFeatured(p.productId, false)}
                        className="w-full mt-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Remove from Featured
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── All Products ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-sm font-bold text-slate-900">All Products</h2>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products to feature..."
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-miki-pink"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {nonFeaturedProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                          {searchQuery
                            ? "No products match your search."
                            : "All products are already featured!"}
                        </td>
                      </tr>
                    ) : (
                      nonFeaturedProducts.map((p) => (
                        <tr key={p.productId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0] || "/images/placeholder.jpg"}
                                alt={p.name}
                                className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {p.productId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 font-semibold">
                            {getCatName(p.categoryId)}
                          </td>
                          <td className="p-4 font-bold text-miki-pink">
                            {formatPrice(p.salePrice || p.basePrice)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                p.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => toggleFeatured(p.productId, true)}
                              className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-3 py-2 rounded-xl flex items-center gap-1 ml-auto transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add to Featured
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
