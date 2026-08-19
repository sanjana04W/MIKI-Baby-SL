"use client";

import React, { useState } from "react";
import { Layers, AlertTriangle, CheckCircle, Save } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";

export default function AdminInventoryPage() {
  const { adminUser, hasPermission } = useAdminAuth();
  const { products, adjustStock } = useStore();

  const [editingStock, setEditingStock] = useState<{ [id: string]: number }>({});
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  if (!adminUser) return null;
  if (!hasPermission("inventory")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="p-10 text-rose-400 font-bold">
            Access Denied: You do not have permission to access Inventory Control.
          </div>
        </div>
      </div>
    );
  }

  const handleStockChange = (id: string, val: number) => {
    setEditingStock((prev) => ({ ...prev, [id]: Math.max(0, val) }));
  };

  const handleSaveStock = (id: string) => {
    const nextVal = editingStock[id];
    if (nextVal !== undefined) {
      adjustStock(id, nextVal);
      setSaveSuccess(id);
      setTimeout(() => setSaveSuccess(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-10 space-y-6 overflow-y-auto w-full max-w-full min-w-0 max-h-[calc(100vh-61px)]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-miki-pink" /> Live Stock & Inventory
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Real-time stock controls, low-stock thresholds, and quick warehouse adjustments.
              </p>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">SKU / ID</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Current Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => {
                    const currentVal =
                      editingStock[p.productId] !== undefined
                        ? editingStock[p.productId]
                        : p.stockLevel;
                    const isSaved = saveSuccess === p.productId;

                    return (
                      <tr key={p.productId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-bold text-slate-900 max-w-xs">{p.name}</td>
                        <td className="p-4 font-mono text-slate-400">{p.productId}</td>
                        <td className="p-4 text-slate-700">{formatPrice(p.basePrice)}</td>
                        <td className="p-4">
                          <span
                            className={`font-black text-sm ${
                              p.stockLevel === 0
                                ? "text-rose-600"
                                : p.stockLevel < 5
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {p.stockLevel} units
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              p.stockStatus === "in_stock"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : p.stockStatus === "low_stock"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {p.stockStatus.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <input
                              type="number"
                              min={0}
                              value={currentVal}
                              onChange={(e) =>
                                handleStockChange(p.productId, Number(e.target.value))
                              }
                              className="w-20 bg-slate-50 border border-slate-200 rounded-xl p-2 text-center text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-miki-pink"
                            />
                            <button
                              onClick={() => handleSaveStock(p.productId)}
                              className="bg-miki-pink hover:bg-miki-rose text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{isSaved ? "Saved!" : "Update"}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
