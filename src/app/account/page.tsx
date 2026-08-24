"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Settings as SettingsIcon,
  LogOut,
  ArrowLeft,
  Pencil,
  Save,
  Lock,
  User,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { formatPrice, formatDate } from "@/lib/utils";
import { Order } from "@/types";

export default function AccountPage() {
  const router = useRouter();
  const { customer, logout, updateProfile, refreshCustomer, isLoading } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "settings">("overview");

  // Editable Profile Settings State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Orders fetched directly from server — same on every device
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !customer) {
      router.push("/login");
    }
  }, [customer, isLoading, router]);

  const loadCustomerOrders = React.useCallback(async (cust: typeof customer) => {
    if (!cust) return;
    setOrdersLoading(true);

    try {
      const params = new URLSearchParams();
      if (cust.email) params.set("email", cust.email);
      if (cust.phone) params.set("phone", cust.phone);
      if (cust.id) params.set("customerId", cust.id);

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      let serverList: Order[] = [];
      if (data.success && Array.isArray(data.orders)) {
        serverList = data.orders;
      }

      // Check local storage for any offline/recent orders placed in this browser
      let localList: Order[] = [];
      try {
        const stored = localStorage.getItem("miki_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const normEmail = cust.email?.trim().toLowerCase();
            const normPhone = cust.phone?.replace(/\D/g, "").replace(/^94/, "0").replace(/^0+/, "");
            const normName = cust.name?.trim().toLowerCase();

            localList = parsed.filter((o: Order) => {
              if (o.customerId && cust.id && o.customerId === cust.id) return true;
              if (normEmail && o.customerInfo?.email?.trim().toLowerCase() === normEmail) return true;
              if (normName && o.customerInfo?.name?.trim().toLowerCase() === normName) return true;
              if (normPhone && o.customerInfo?.phone) {
                const oPhone = o.customerInfo.phone.replace(/\D/g, "").replace(/^94/, "0").replace(/^0+/, "");
                if (oPhone && oPhone === normPhone) return true;
              }
              return false;
            });
          }
        }
      } catch {}

      // Merge server + local
      const orderMap = new Map<string, Order>();
      serverList.forEach((o) => orderMap.set(o.orderId, o));

      // If any local order was not yet on the server, upload it immediately
      for (const loc of localList) {
        if (!orderMap.has(loc.orderId)) {
          orderMap.set(loc.orderId, loc);
          fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loc),
            keepalive: true,
          }).catch(() => {});
        }
      }

      const merged = Array.from(orderMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setMyOrders(merged);
    } catch (e) {
      console.warn("Failed to load orders:", e);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (customer) {
      setFullName(customer.name || "");
      setPhoneNumber(customer.phone || "");
      setDeliveryAddress(customer.address || "");

      // Refresh fresh customer data & load their orders
      loadCustomerOrders(customer);
    }
  }, [customer, loadCustomerOrders]);

  if (isLoading || !customer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
      </div>
    );
  }

  const totalSpent = myOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Dispatched":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Confirmed":
        return "bg-sky-100 text-sky-700 border-sky-200";
      case "Processing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"; // Pending
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: fullName.trim(),
        phone: phoneNumber.trim(),
        address: deliveryAddress.trim(),
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Back to Shop Link */}
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-miki-pink tracking-wider uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO SHOP</span>
          </Link>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Left Sidebar Card */}
          <div className="w-full md:w-80 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 shrink-0">
            {/* User Profile Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-miki-pink text-white font-black text-2xl flex items-center justify-center shadow-md shadow-pink-100 shrink-0">
                {customer.name ? customer.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-black text-slate-900 truncate leading-tight">
                  {customer.name}
                </h2>
                <p className="text-[10px] font-bold text-miki-pink uppercase tracking-widest mt-0.5">
                  CUSTOMER
                </p>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-1.5">
              {/* Overview Tab */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("overview");
                  loadCustomerOrders(customer);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all text-left relative cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-rose-50 text-miki-pink border border-rose-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {activeTab === "overview" && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1.5 bg-miki-pink rounded-r-full" />
                )}
                <LayoutGrid className={`w-4 h-4 ${activeTab === "overview" ? "text-miki-pink" : "text-slate-400"}`} />
                <span>Overview</span>
              </button>

              {/* Order History Tab */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("orders");
                  loadCustomerOrders(customer);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all text-left relative cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-rose-50 text-miki-pink border border-rose-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {activeTab === "orders" && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1.5 bg-miki-pink rounded-r-full" />
                )}
                <Package className={`w-4 h-4 ${activeTab === "orders" ? "text-miki-pink" : "text-slate-400"}`} />
                <span className="flex-1">Order History</span>
                {myOrders.length > 0 && (
                  <span className="bg-miki-pink text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                    {myOrders.length}
                  </span>
                )}
              </button>

              {/* Settings Tab */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("settings");
                  refreshCustomer();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all text-left relative cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-rose-50 text-miki-pink border border-rose-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {activeTab === "settings" && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1.5 bg-miki-pink rounded-r-full" />
                )}
                <SettingsIcon className={`w-4 h-4 ${activeTab === "settings" ? "text-miki-pink" : "text-slate-400"}`} />
                <span>Settings</span>
              </button>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Right Main Content Card */}
          <div className="flex-1 w-full bg-white rounded-3xl p-6 sm:p-9 border border-slate-100 shadow-sm min-h-[480px]">
            {/* VIEW 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-7 animate-in fade-in duration-200">
                {/* Header */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                    Welcome Back, {customer.name}!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Manage your order history, delivery details, and keep your contact information up-to-date.
                  </p>
                </div>

                {/* 3 Stat KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Total Orders */}
                  <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-xs space-y-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      TOTAL ORDERS
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                      {myOrders.length}
                    </p>
                  </div>

                  {/* Total Spent */}
                  <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-xs space-y-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      TOTAL SPENT
                    </p>
                    <p className="text-2xl font-black text-miki-pink">
                      {formatPrice(totalSpent)}
                    </p>
                  </div>

                  {/* Member Since */}
                  <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-xs space-y-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      MEMBER SINCE
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                      {customer.createdAt ? formatDate(customer.createdAt) : "Aug 2026"}
                    </p>
                  </div>
                </div>

                {/* Account Overview Box */}
                <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/40 space-y-5">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Account Overview
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        EMAIL ADDRESS
                      </p>
                      <p className="font-bold text-slate-900">{customer.email}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        PHONE NUMBER
                      </p>
                      <p className="font-bold text-slate-900">
                        {customer.phone || "+94 77 123 4567"}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        DEFAULT DELIVERY ADDRESS
                      </p>
                      <p className="font-bold text-slate-900">
                        {customer.address || "No delivery address provided yet."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: ORDER HISTORY */}
            {activeTab === "orders" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-miki-pink">
                      <Package className="w-4 h-4" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 font-heading">
                      Order History
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-miki-pink bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                    {myOrders.length} Orders
                  </span>
                </div>

                {/* Orders List */}
                {myOrders.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-center mx-auto text-miki-pink shadow-xs">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">No Orders Yet</h3>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                        You haven&apos;t placed any orders with this account yet. Explore our handcrafted nursery art!
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-miki-pink to-rose-500 hover:from-rose-500 hover:to-miki-pink text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-pink-100 transition-all active:scale-95"
                    >
                      <span>Explore Shop</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map((order) => (
                      <div
                        key={order.orderId}
                        className="p-6 rounded-3xl border border-slate-100 bg-white shadow-xs space-y-4 hover:border-slate-200 transition-colors"
                      >
                        {/* Order Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">
                              {order.orderId}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${getStatusColor(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2 text-xs text-slate-700">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="font-medium">
                                {item.quantity}x {item.name} {item.variant ? `(${item.variant})` : ""}
                              </span>
                              <span className="font-bold text-slate-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total Paid Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                          <span className="text-slate-500 font-medium">Total (COD)</span>
                          <span className="text-sm font-black text-miki-pink">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: SETTINGS / PERSONAL INFORMATION */}
            {activeTab === "settings" && (
              <div className="space-y-7 animate-in fade-in duration-200">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-miki-pink">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 font-heading">
                      Personal Information
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      YOUR BASIC ACCOUNT DETAILS
                    </p>
                  </div>
                </div>

                {saveSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your account details have been saved successfully!</span>
                  </div>
                )}

                {/* Edit Form */}
                <form onSubmit={handleSaveChanges} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-miki-pink" />
                          <span>Full Name</span>
                        </label>
                        <span className="text-[11px] font-bold text-miki-pink flex items-center gap-0.5">
                          <Pencil className="w-3 h-3" /> Edit
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-miki-pink focus:ring-2 focus:ring-rose-100 rounded-2xl p-3.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition-all"
                      />
                    </div>

                    {/* Email Address (Disabled) */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        disabled
                        value={customer.email}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl p-3.5 text-xs sm:text-sm font-semibold outline-none cursor-not-allowed"
                      />
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Email address cannot be changed
                      </p>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700 flex items-center gap-1.5">
                          <span>📞 Phone Number</span>
                        </label>
                        <span className="text-[11px] font-bold text-miki-pink flex items-center gap-0.5">
                          <Pencil className="w-3 h-3" /> Edit
                        </span>
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-miki-pink focus:ring-2 focus:ring-rose-100 rounded-2xl p-3.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition-all max-w-md"
                      />
                    </div>

                    {/* Default Delivery Address */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700 flex items-center gap-1.5">
                          <span>📍 Default Delivery Address</span>
                        </label>
                        <span className="text-[11px] font-bold text-miki-pink flex items-center gap-0.5">
                          <Pencil className="w-3 h-3" /> Edit
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-miki-pink focus:ring-2 focus:ring-rose-100 rounded-2xl p-3.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Save Changes Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-gradient-to-r from-miki-pink to-rose-500 hover:from-rose-500 hover:to-miki-pink text-white font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-2xl shadow-lg shadow-pink-200/60 flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-70"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "SAVING..." : "SAVE CHANGES"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
