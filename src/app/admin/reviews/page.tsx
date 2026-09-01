"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  Clock,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { Review } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminReviewsPage() {
  const router = useRouter();
  const { adminUser, hasPermission } = useAdminAuth();
  const { reviews, updateReviewStatus, deleteReview, refreshReviews } = useStore();

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!adminUser) {
      router.push("/admin/login");
    }
  }, [adminUser, router]);

  if (!adminUser) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshReviews();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleStatusChange = async (reviewId: string, status: "approved" | "rejected") => {
    const success = await updateReviewStatus(reviewId, status);
    if (success) {
      setActionMessage({
        type: "success",
        text: `Review marked as ${status === "approved" ? "Approved & Published" : "Rejected"}.`,
      });
    } else {
      setActionMessage({ type: "error", text: "Failed to update review status." });
    }
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleDelete = async (reviewId: string) => {
    const success = await deleteReview(reviewId);
    if (success) {
      setActionMessage({ type: "success", text: "Review deleted successfully." });
      setDeleteConfirmId(null);
    } else {
      setActionMessage({ type: "error", text: "Failed to delete review." });
    }
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Stats calculation
  const totalCount = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;
  const averageRating =
    totalCount > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
      : "5.0";

  // Filtered reviews list
  const filteredReviews = reviews.filter((rev) => {
    // Tab filter
    if (activeTab !== "all" && rev.status !== activeTab) return false;

    // Rating filter
    if (ratingFilter !== "all" && rev.rating !== ratingFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchProduct = (rev.productName || "").toLowerCase().includes(q);
      const matchAuthor = (rev.author || "").toLowerCase().includes(q);
      const matchComment = (rev.comment || "").toLowerCase().includes(q);
      const matchTitle = (rev.title || "").toLowerCase().includes(q);
      const matchOrder = (rev.orderId || "").toLowerCase().includes(q);
      return matchProduct || matchAuthor || matchComment || matchTitle || matchOrder;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                  Customer Reviews & Ratings
                </h1>
                <span className="bg-rose-50 text-miki-pink text-xs font-black px-3 py-1 rounded-full border border-rose-100 shadow-2xs">
                  {totalCount} Total
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Moderate, approve, and manage customer product reviews from verified purchasers.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-miki-pink" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Action Notification Alert */}
          {actionMessage && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in ${
                actionMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              <span>{actionMessage.text}</span>
              <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>
          )}

          {/* Stats Cards Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  AVG RATING
                </span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {averageRating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Across all customer feedback</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  APPROVED
                </span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading">
                {approvedCount}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Live on storefront pages</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  PENDING REVIEW
                </span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 font-heading">
                {pendingCount}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Awaiting moderation</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  REJECTED
                </span>
                <XCircle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-500 font-heading">
                {rejectedCount}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Hidden from catalog</p>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: "all", label: `All Reviews (${totalCount})` },
                { id: "pending", label: `Pending Moderation (${pendingCount})` },
                { id: "approved", label: `Approved (${approvedCount})` },
                { id: "rejected", label: `Rejected (${rejectedCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search and Star Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by customer name, product, review title, order ID, or keywords..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="sm:col-span-4 flex items-center gap-2">
                <select
                  value={ratingFilter}
                  onChange={(e) =>
                    setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))
                  }
                  className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-2xl py-2.5 px-3 text-xs font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">All Star Ratings</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars Only</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars Only</option>
                  <option value="3">⭐⭐⭐ 3 Stars Only</option>
                  <option value="2">⭐⭐ 2 Stars Only</option>
                  <option value="1">⭐ 1 Star Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List / Table */}
          {filteredReviews.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Reviews Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No customer reviews match your selected filter or search term.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md transition-shadow space-y-4"
                >
                  {/* Top Bar: Customer + Product + Rating + Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-miki-pink text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                        {rev.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{rev.author}</span>
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-emerald-200/60 flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                            Verified Buyer
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{rev.date}</span>
                          <span>•</span>
                          <span>Order: <strong className="text-slate-600">{rev.orderId || "Direct"}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Star Rating Display */}
                      <div className="flex items-center text-amber-400 gap-0.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-black text-amber-900 ml-1">{rev.rating}.0</span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                          rev.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : rev.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {rev.status}
                      </span>
                    </div>
                  </div>

                  {/* Product Details Link */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-2xl">
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Product:</span>
                    {rev.productSlug ? (
                      <Link
                        href={`/shop/${rev.productSlug}`}
                        target="_blank"
                        className="text-miki-pink hover:underline flex items-center gap-1"
                      >
                        <span>{rev.productName || rev.productSlug}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span>{rev.productName || rev.productId}</span>
                    )}
                  </div>

                  {/* Review Title & Comment */}
                  <div className="space-y-1">
                    {rev.title && (
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        "{rev.title}"
                      </h4>
                    )}
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Bottom Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {rev.status !== "approved" && (
                        <button
                          onClick={() => handleStatusChange(rev.id, "approved")}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve Review</span>
                        </button>
                      )}

                      {rev.status !== "rejected" && (
                        <button
                          onClick={() => handleStatusChange(rev.id, "rejected")}
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-slate-200"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}
                    </div>

                    <div>
                      {deleteConfirmId === rev.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-600">Delete permanently?</span>
                          <button
                            onClick={() => handleDelete(rev.id)}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(rev.id)}
                          className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
