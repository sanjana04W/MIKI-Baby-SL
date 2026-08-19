"use client";

import React, { useState } from "react";
import { Package, Plus, Edit, Trash2, Search, CheckCircle, AlertTriangle, Eye } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProductModal } from "@/components/admin/ProductModal";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

export default function AdminProductsPage() {
  const { adminUser, hasPermission } = useAdminAuth();
  const { products, deleteProduct, categories } = useStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!adminUser) return null;
  if (!hasPermission("products")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="p-10 text-rose-400 font-bold">Access Denied: You do not have permission to manage catalog products.</div>
        </div>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setSelectedProduct(p);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from catalog?`)) {
      deleteProduct(id);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.productId.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-10 space-y-6 overflow-y-auto w-full max-w-full min-w-0 max-h-[calc(100vh-61px)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-miki-pink" /> Product Catalog
            </h1>
            <p className="text-xs text-slate-500">
              Manage handcrafted wall art frames, canvas sizes, pricing, and live inventory.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto justify-center bg-miki-pink hover:bg-rose-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name or SKU..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-miki-pink"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Total Catalog: <strong className="text-slate-900">{filteredProducts.length}</strong> items
          </span>
        </div>

        {/* Products Table */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Dimensions</th>
                  <th className="p-4">Price (LKR)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                      No products found. Click "Add New Product" to create one!
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const cat = categories.find((c) => c.categoryId === p.categoryId);
                    return (
                      <tr key={p.productId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                              <span className="text-[10px] text-slate-400 font-mono">SKU: {p.productId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">{cat?.name || p.categoryId}</td>
                        <td className="p-4 text-slate-500">{p.dimensions}</td>
                        <td className="p-4 font-bold text-miki-pink">
                          {formatPrice(p.salePrice || p.basePrice)}
                          {p.salePrice && (
                            <span className="block text-[10px] text-slate-400 line-through">
                              {formatPrice(p.basePrice)}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              p.stockStatus === "in_stock"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : p.stockStatus === "low_stock"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {p.stockLevel} units ({p.stockStatus.replace("_", " ")})
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              p.status === "active"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="bg-white hover:bg-slate-50 text-slate-700 p-2 rounded-lg border border-slate-200 shadow-xs cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {adminUser.role === "owner" && (
                              <button
                                onClick={() => handleDelete(p.productId, p.name)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg border border-rose-200 cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        </main>
      </div>

      {/* Product Edit / Add Modal */}
      {isModalOpen && (
        <ProductModal product={selectedProduct} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
