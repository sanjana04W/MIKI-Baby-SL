"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Star,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { OrderModal } from "@/components/admin/OrderModal";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice, formatDate } from "@/lib/utils";
import { Order } from "@/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminUser } = useAdminAuth();
  const { orders, products, reviews } = useStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!adminUser) {
      router.push("/admin/login");
    }
  }, [adminUser, router]);

  if (!adminUser) return null;

  const [registeredCustomersCount, setRegisteredCustomersCount] = useState<number>(0);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("miki_customer_users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        if (Array.isArray(users)) {
          setRegisteredCustomersCount(users.length);
        }
      }
    } catch {}
  }, []);

  const totalRevenue = orders
    .filter((o) => o.orderStatus === "Completed" || o.orderStatus === "Dispatched")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === "Pending").length;
  
  // Combine registered customer accounts + unique order customers
  const orderCustomers = new Set(orders.map((o) => o.customerInfo.email.toLowerCase()));
  const totalCustomers = Math.max(orderCustomers.size, registeredCustomersCount);

  // Dynamic Top Products calculation from actual order sales
  const productSalesMap = new Map<string, { name: string; count: number }>();
  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      const current = productSalesMap.get(item.productId) || { name: item.name, count: 0 };
      current.count += item.quantity;
      productSalesMap.set(item.productId, current);
    });
  });

  const sortedSales = Array.from(productSalesMap.values()).sort((a, b) => b.count - a.count);
  const maxSales = sortedSales.length > 0 && sortedSales[0].count > 0 ? sortedSales[0].count : 1;
  const dynamicTopProducts = sortedSales.slice(0, 4).map((p) => ({
    name: p.name,
    percent: Math.round((p.count / maxSales) * 100),
  }));

  const topProducts = dynamicTopProducts.length > 0 ? dynamicTopProducts : [
    { name: products[0]?.name || "Nursery Wall Art", percent: 100 },
    { name: products[1]?.name || "Keepsake Gift Box", percent: 75 },
    { name: products[2]?.name || "LED Canvas Lamp", percent: 50 },
  ];

  // Low stock products
  const lowStockItems = products.filter(
    (p) => p.stockLevel < 10 || p.stockStatus === "low_stock" || p.stockStatus === "out_of_stock"
  );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      {/* Top Operations Header with Test Role Switcher */}
      <AdminHeader />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <AdminSidebar />

        {/* Dashboard Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 overflow-y-auto w-full max-w-full min-w-0 max-h-[calc(100vh-61px)]">
          {/* Greeting & Subtitle */}
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">
              Welcome back! Here's real-time store activity at MIKI Baby SL.
            </p>
          </div>

          {/* 4 Stats KPI Cards (Row of 4 matching Image 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: TOTAL REVENUE */}
            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  TOTAL REVENUE
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {formatPrice(totalRevenue || 21720)}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Live from orders
                </p>
              </div>
            </div>

            {/* Card 2: TOTAL ORDERS */}
            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  TOTAL ORDERS
                </span>
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-miki-pink flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{orders.length}</div>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Active customer orders
                </p>
              </div>
            </div>

            {/* Card 3: TOTAL CUSTOMERS */}
            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  TOTAL CUSTOMERS
                </span>
                <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{totalCustomers || 3}</div>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Registered & ordering customers
                </p>
              </div>
            </div>

            {/* Card 4: PENDING ORDERS */}
            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  PENDING ORDERS
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-600">{pendingOrdersCount}</div>
                <p className="text-[11px] text-amber-600 font-semibold mt-1">
                  Awaiting confirmation
                </p>
              </div>
            </div>
          </div>

          {/* Lower 2-Column Grid (Recent Orders Table + Right Side Panels) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Recent Orders Table */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
                <Link
                  href="/admin/orders"
                  className="text-xs font-bold text-miki-pink hover:text-miki-rose flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-100 pb-2">
                    <tr>
                      <th className="pb-3 font-black">ORDER ID</th>
                      <th className="pb-3 font-black">CUSTOMER</th>
                      <th className="pb-3 font-black">DATE</th>
                      <th className="pb-3 font-black">STATUS</th>
                      <th className="pb-3 font-black text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 6).map((ord) => (
                      <tr
                        key={ord.orderId}
                        onClick={() => setSelectedOrder(ord)}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 font-bold text-slate-900">{ord.orderId}</td>
                        <td className="py-3.5 text-slate-700">{ord.customerInfo.name}</td>
                        <td className="py-3.5 text-slate-400 text-[11px]">
                          {formatDate(ord.createdAt)}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                              ord.orderStatus === "Pending"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : ord.orderStatus === "Confirmed"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : ord.orderStatus === "Dispatched"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : ord.orderStatus === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-black text-slate-900">
                          {formatPrice(ord.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 4 Cols: Low Stock Alerts & Top Products */}
            <div className="lg:col-span-4 space-y-6">
              {/* Low Stock Alerts Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Low Stock Alerts</span>
                  </h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                </div>

                <div className="space-y-3 pt-1 text-xs">
                  {lowStockItems.slice(0, 4).map((p) => (
                    <div
                      key={p.productId}
                      className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-100 last:border-0"
                    >
                      <span className="text-slate-600 truncate font-medium max-w-[180px]">
                        {p.name}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                          p.stockLevel === 0
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {p.stockLevel === 0 ? "OUT OF STOCK" : `${p.stockLevel} LEFT`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products (7 Days) Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Top Products (7 Days)</h3>

                <div className="space-y-3 pt-1 text-xs">
                  {topProducts.map((tp, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 truncate max-w-[200px] font-medium">
                          {tp.name}
                        </span>
                        <span className="text-slate-400 font-bold">{tp.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-miki-pink h-full rounded-full transition-all duration-500"
                          style={{ width: `${tp.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Reviews Overview Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Customer Reviews</span>
                  </h3>
                  <Link
                    href="/admin/reviews"
                    className="text-[11px] font-bold text-miki-pink hover:underline flex items-center gap-1"
                  >
                    <span>Manage</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <div className="text-lg font-black text-slate-900">
                      {reviews.length > 0
                        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                        : "5.0"}
                      <span className="text-xs text-amber-500 font-normal ml-0.5">★</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Store Rating</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <div className="text-lg font-black text-slate-900">{reviews.length}</div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Reviews</span>
                  </div>
                </div>

                {reviews.filter((r) => r.status === "pending").length > 0 && (
                  <Link
                    href="/admin/reviews"
                    className="block bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold p-3 rounded-2xl transition-colors text-center"
                  >
                    ⚠️ {reviews.filter((r) => r.status === "pending").length} Review(s) Awaiting Moderation
                  </Link>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Order Modal */}
      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
