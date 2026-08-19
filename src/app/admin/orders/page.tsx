"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Filter,
  MessageCircle,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  Download,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { OrderModal } from "@/components/admin/OrderModal";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice, formatDate, generateWhatsAppOrderLink } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { adminUser, hasPermission } = useAdminAuth();
  const { orders } = useStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  if (!adminUser) return null;
  if (!hasPermission("orders")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="p-10 text-rose-400 font-bold">Access Denied: You do not have permission to view Order Management.</div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus !== "all" && ord.orderStatus !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = ord.orderId.toLowerCase().includes(q);
      const matchName = ord.customerInfo.name.toLowerCase().includes(q);
      const matchPhone = ord.customerInfo.phone.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Phone",
      "Email",
      "Address",
      "District",
      "Total Amount",
      "Order Status",
      "Created At",
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.orderId}"`,
      `"${o.customerInfo.name}"`,
      `"${o.customerInfo.phone}"`,
      `"${o.customerInfo.email}"`,
      `"${o.customerInfo.address.replace(/"/g, '""')}"`,
      `"${o.customerInfo.district}"`,
      o.totalAmount,
      o.orderStatus,
      `"${o.createdAt}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `miki_orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-miki-pink" /> Order Management System
            </h1>
            <p className="text-xs text-slate-500">
              Manage Sri Lanka COD orders, verify payments, update delivery status, and trigger WhatsApp notifications.
            </p>
          </div>

          <button
            onClick={exportToCSV}
            className="w-full sm:w-auto justify-center bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-miki-pink" />
            <span>Export Orders to CSV</span>
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-semibold pb-1 sm:pb-0">
            {["all", "Pending", "Confirmed", "Processing", "Dispatched", "Completed", "Cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-colors shrink-0 cursor-pointer ${
                  filterStatus === st
                    ? "bg-miki-pink text-white font-bold shadow-xs"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Name, Phone..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-miki-pink"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">District</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                      No orders match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const waLink = generateWhatsAppOrderLink(
                      ord.customerInfo.phone,
                      ord.orderId,
                      ord.customerInfo.name,
                      ord.totalAmount,
                      ord.items.reduce((s, i) => s + i.quantity, 0)
                    );

                    return (
                      <tr key={ord.orderId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          <p>{ord.orderId}</p>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {formatDate(ord.createdAt)}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{ord.customerInfo.name}</p>
                          <p className="text-[10px] text-slate-400">{ord.customerInfo.phone}</p>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">{ord.customerInfo.district}</td>
                        <td className="p-4">{ord.items.reduce((s, i) => s + i.quantity, 0)} item(s)</td>
                        <td className="p-4 font-bold text-miki-pink">{formatPrice(ord.totalAmount)}</td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
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
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Contact Customer on WhatsApp"
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 p-2 rounded-lg border border-emerald-200 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-miki-pink" /> Inspect
                            </button>
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

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
