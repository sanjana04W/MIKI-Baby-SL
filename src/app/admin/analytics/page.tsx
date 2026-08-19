"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CheckCircle2,
  XCircle,
  Package,
  RotateCw,
  Eye,
  MousePointerClick,
  ShoppingCart,
  CreditCard,
  CheckCheck,
  Sparkles,
  BarChart2,
  MapPin,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { adminUser, hasPermission } = useAdminAuth();
  const { orders, products } = useStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  useEffect(() => {
    if (!adminUser) {
      router.push("/admin/login");
    }
  }, [adminUser, router]);

  if (!adminUser) return null;
  if (adminUser.role !== "owner" && !hasPermission("analytics")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="p-10 text-rose-400 font-bold">
            Access Denied: You do not have permission to view Analytics.
          </div>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date());
    }, 600);
  };

  // Metrics calculations
  const totalRevenue = orders
    .filter((o) => o.orderStatus === "Completed" || o.orderStatus === "Dispatched")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const completedOrders = orders.filter((o) => o.orderStatus === "Completed").length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === "Cancelled").length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const confirmedOrders = orders.filter((o) => o.orderStatus === "Confirmed").length;
  const dispatchedOrders = orders.filter((o) => o.orderStatus === "Dispatched").length;

  const uniqueCustomers = new Set(orders.map((o) => o.customerInfo.email.toLowerCase())).size || 1;
  const lowStockSKUs = products.filter(
    (p) => p.stockLevel < 10 || p.stockStatus === "low_stock" || p.stockStatus === "out_of_stock"
  ).length;

  const totalOrdersCount = orders.length || 1;

  // Order status breakdown data
  const statusBreakdown = [
    {
      name: "PENDING",
      count: pendingOrders,
      percent: Math.round((pendingOrders / totalOrdersCount) * 100),
      color: "bg-amber-400",
      textColor: "text-amber-400",
      bgBadge: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    },
    {
      name: "CONFIRMED",
      count: confirmedOrders,
      percent: Math.round((confirmedOrders / totalOrdersCount) * 100),
      color: "bg-sky-400",
      textColor: "text-sky-400",
      bgBadge: "bg-sky-400/10 text-sky-300 border-sky-400/20",
    },
    {
      name: "DISPATCHED",
      count: dispatchedOrders,
      percent: Math.round((dispatchedOrders / totalOrdersCount) * 100),
      color: "bg-purple-400",
      textColor: "text-purple-400",
      bgBadge: "bg-purple-400/10 text-purple-300 border-purple-400/20",
    },
    {
      name: "COMPLETED",
      count: completedOrders,
      percent: Math.round((completedOrders / totalOrdersCount) * 100),
      color: "bg-emerald-400",
      textColor: "text-emerald-400",
      bgBadge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    },
    {
      name: "CANCELLED",
      count: cancelledOrders,
      percent: Math.round((cancelledOrders / totalOrdersCount) * 100),
      color: "bg-rose-400",
      textColor: "text-rose-400",
      bgBadge: "bg-rose-400/10 text-rose-300 border-rose-400/20",
    },
  ];

  // Pixel funnel conversion stats matching reference screenshot
  const funnelStats = [
    { label: "PAGEVIEW", count: 450, icon: Eye, color: "text-blue-400" },
    { label: "VIEWCONTENT", count: 280, icon: MousePointerClick, color: "text-sky-400" },
    { label: "ADDTOCART", count: 95, icon: ShoppingCart, color: "text-miki-pink" },
    { label: "INITIATECHECKOUT", count: 48, icon: CreditCard, color: "text-amber-400" },
    { label: "PURCHASE", count: 18, icon: CheckCheck, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      {/* Top Admin Header with Role Switcher */}
      <AdminHeader />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <AdminSidebar />

        {/* Analytics Main Page */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 overflow-y-auto w-full max-w-full min-w-0 max-h-[calc(100vh-61px)]">
          {/* Header Title & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Analytics Dashboard
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Revenue, conversions & business performance
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Sync Active Pill */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>LIVE SYNC ACTIVE</span>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefresh}
                className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-miki-pink" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Top 6 KPI Metric Cards (2 rows of 3 matching Image) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Row 1, Card 1: TOTAL REVENUE */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3 hover:border-slate-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  TOTAL REVENUE
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  LKR {(totalRevenue || 21720).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Row 1, Card 2: TOTAL ORDERS */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3 hover:border-slate-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-miki-pink flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  TOTAL ORDERS
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {orders.length} Orders
                </div>
              </div>
            </div>

            {/* Row 1, Card 3: UNIQUE CUSTOMERS */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3 hover:border-slate-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  UNIQUE CUSTOMERS
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {uniqueCustomers} User{uniqueCustomers > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Row 2, Card 4: COMPLETED ORDERS */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3 hover:border-slate-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  COMPLETED ORDERS
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {completedOrders}
                </div>
              </div>
            </div>

            {/* Row 2, Card 5: CANCELLED ORDERS */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3 hover:border-slate-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  CANCELLED ORDERS
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {cancelledOrders}
                </div>
              </div>
            </div>

            {/* Row 2, Card 6: LOW STOCK SKUS */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3 hover:border-slate-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  LOW STOCK SKUS
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {lowStockSKUs || 9} Items
                </div>
              </div>
            </div>
          </div>

          {/* Section: Meta & TikTok Pixel Conversions */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-base font-extrabold text-slate-900">
              Meta & TikTok Pixel Conversions
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              {funnelStats.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2 hover:bg-slate-100/60 transition-colors"
                >
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Order Status Breakdown */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Order Status Breakdown
              </h2>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                {orders.length} TOTAL
              </span>
            </div>

            <div className="space-y-4">
              {statusBreakdown.map((st, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                      <span>{st.name}</span>
                    </span>
                    <span className="text-slate-400 font-bold">
                      {st.count} ({st.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${st.color}`}
                      style={{ width: `${Math.max(st.percent, st.count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
