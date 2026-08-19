"use client";

import React, { useState } from "react";
import { Tag, Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";

export default function AdminPromotionsPage() {
  const { adminUser } = useAdminAuth();
  const { promotions, addPromotion, togglePromotion } = useStore();

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(10);

  if (!adminUser) return null;

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    addPromotion({
      code: code.trim().toUpperCase(),
      title,
      discountType,
      discountValue: Number(discountValue),
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      isActive: true,
    });

    setCode("");
    setTitle("");
    setDiscountValue(10);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-10 space-y-6 overflow-y-auto w-full max-w-full min-w-0 max-h-[calc(100vh-61px)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-miki-pink" /> Promotions & Offers Management
            </h1>
            <p className="text-xs text-slate-500">
              Create and activate discount promo codes for Facebook ad campaigns and seasonal sales.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-5">
            <form onSubmit={handleCreatePromo} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4 text-xs">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Create New Promo Code
              </h2>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Promo Code Name *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. MIKIBABY10"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 uppercase font-bold outline-none focus:ring-2 focus:ring-miki-pink"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Campaign Description *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 10% Facebook Welcome Discount"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-miki-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (LKR)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-miki-pink hover:bg-miki-rose text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> Create Promo Code
              </button>
            </form>
          </div>

          {/* Active Promo Table */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-900">
                Active Promotions & Discount Codes
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Campaign Title</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {promotions.map((p) => (
                      <tr key={p.promoId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-bold text-miki-pink">{p.code}</td>
                        <td className="p-3 text-slate-700">{p.title}</td>
                        <td className="p-3 font-bold text-slate-900">
                          {p.discountType === "percentage" ? `${p.discountValue}%` : `Rs. ${p.discountValue}`}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => togglePromotion(p.promoId)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-colors cursor-pointer ${
                              p.isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-400 border border-slate-200"
                            }`}
                          >
                            {p.isActive ? "ACTIVE" : "INACTIVE"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
