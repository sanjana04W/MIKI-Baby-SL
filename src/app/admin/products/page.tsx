"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProductModal } from "@/components/admin/ProductModal";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { logAdminAction } from "@/lib/auditDb";

export default function AdminProductsPage() {
  const { adminUser, hasPermission } = useAdminAuth();
  const { products, deleteProduct, categories } = useStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!adminUser) return null;
  if (!hasPermission("products")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="p-10 text-rose-400 font-bold">
            Access Denied: You do not have permission to manage catalog products.
          </div>
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
      if (adminUser) {
        logAdminAction({
          action: "PRODUCT_DELETED",
          adminName: adminUser.name,
          adminEmail: adminUser.email,
          adminRole: adminUser.role,
          targetType: "product",
          targetId: id,
          targetName: name,
          details: `Deleted product "${name}" (SKU: ${id}) from the catalog.`,
        });
      }
    }
  };

  const toggleRow = (productId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset page when filters change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };
  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };
  const handleItemsPerPageChange = (val: number) => {
    setItemsPerPage(val);
    setCurrentPage(1);
  };

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
              onClick={handleOpenAdd}
              className="w-full sm:w-auto justify-center bg-miki-pink hover:bg-rose-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search product name or SKU..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-miki-pink"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-miki-pink"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs font-semibold text-slate-500">
              Total: <strong className="text-slate-900">{filteredProducts.length}</strong> items
            </span>
          </div>

          {/* Products Table */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="p-4 w-8"></th>
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
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                        No products found. Click &quot;Add New Product&quot; to create one!
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((p) => {
                      const cat = categories.find((c) => c.categoryId === p.categoryId);
                      const hasVariants = p.variants && p.variants.length > 0;
                      const isExpanded = expandedRows.has(p.productId);

                      return (
                        <React.Fragment key={p.productId}>
                          <tr className="hover:bg-slate-50/70 transition-colors">
                            {/* Expand Toggle */}
                            <td className="p-4">
                              {hasVariants ? (
                                <button
                                  onClick={() => toggleRow(p.productId)}
                                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                  title={isExpanded ? "Collapse variants" : "Expand variants"}
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              ) : null}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    SKU: {p.productId}
                                  </span>
                                  {hasVariants && (
                                    <span className="ml-2 text-[9px] bg-sky-50 text-sky-600 font-bold px-1.5 py-0.5 rounded border border-sky-100">
                                      {p.variants!.length} variants
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-slate-700">
                              {cat?.name || p.categoryId}
                            </td>
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

                          {/* ── Expanded Variant Sub-rows ── */}
                          {isExpanded && hasVariants && (
                            <tr>
                              <td colSpan={8} className="p-0">
                                <div className="bg-sky-50/40 border-t border-b border-sky-100 px-6 py-3">
                                  <table className="w-full text-left text-xs text-slate-600">
                                    <thead>
                                      <tr className="text-[10px] font-black text-slate-400 uppercase">
                                        <td className="pb-2 pl-8">Variant</td>
                                        <td className="pb-2">Price</td>
                                        <td className="pb-2">Stock</td>
                                        <td className="pb-2">Status</td>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sky-100">
                                      {p.variants!.map((v) => (
                                        <tr key={v.id}>
                                          <td className="py-2 pl-8 font-semibold text-slate-700">
                                            {v.name}
                                          </td>
                                          <td className="py-2 font-bold text-slate-800">
                                            {formatPrice(v.price)}
                                          </td>
                                          <td className="py-2">{v.stock} units</td>
                                          <td className="py-2">
                                            <span
                                              className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                                                v.stock > 5
                                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                  : v.stock > 0
                                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                                              }`}
                                            >
                                              {v.stock > 5
                                                ? "In Stock"
                                                : v.stock > 0
                                                ? "Low Stock"
                                                : "Out of Stock"}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination Controls ── */}
            {filteredProducts.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 bg-white">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>per page</span>
                  <span className="ml-2 text-slate-400">
                    Showing {startIndex + 1}–{endIndex} of {filteredProducts.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage(safePage - 1)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((pg) => pg === 1 || pg === totalPages || Math.abs(pg - safePage) <= 1)
                    .map((pg, idx, arr) => (
                      <React.Fragment key={pg}>
                        {idx > 0 && arr[idx - 1] !== pg - 1 && (
                          <span className="px-1 text-slate-300 text-xs">…</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(pg)}
                          className={`min-w-[32px] h-8 rounded-lg text-xs font-bold cursor-pointer ${
                            pg === safePage
                              ? "bg-miki-pink text-white shadow"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {pg}
                        </button>
                      </React.Fragment>
                    ))}

                  <button
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage(safePage + 1)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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
