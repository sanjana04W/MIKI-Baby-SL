"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  Shield,
  ChevronDown,
  Check,
  TrendingUp,
  Clock,
  LogOut,
  X,
  Mail,
  CheckCheck,
  Menu,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { getMessages, markMessageRead, markAllMessagesRead, getUnreadCount } from "@/lib/adminMessages";

import { ShoppingBag as OrderBagIcon } from "lucide-react";

interface NotificationItem {
  id: string;
  type: "message" | "order";
  title: string;
  senderName: string;
  preview: string;
  time: string;
  rawDate: string;
  link: string;
}

const READ_ORDERS_KEY = "miki_read_order_notifications";

export const AdminHeader: React.FC = () => {
  const router = useRouter();
  const { adminUser, switchRole, logout } = useAdminAuth();
  const { orders } = useStore();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const toggleMobileSidebar = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("miki_toggle_admin_sidebar"));
    }
  };

  // Build notifications from unread messages and new orders
  const refreshNotifications = () => {
    try {
      // 1. Unread Messages
      const unreadMsgs: NotificationItem[] = getMessages()
        .filter((m) => m.status === "unread")
        .map((m) => ({
          id: m.id,
          type: "message" as const,
          title: "New Contact Message",
          senderName: m.name,
          preview: m.subject ? `"${m.subject}" - ${m.message}` : `"${m.message}"`,
          time: new Date(m.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          rawDate: m.createdAt,
          link: "/admin/messages",
        }));

      // 2. Unread Orders (Orders that haven't been dismissed/read)
      const readOrderIdsStr = localStorage.getItem(READ_ORDERS_KEY);
      const readOrderIds: string[] = readOrderIdsStr ? JSON.parse(readOrderIdsStr) : [];
      const readSet = new Set(readOrderIds);

      const unreadOrders: NotificationItem[] = orders
        .filter((o) => !readSet.has(o.orderId))
        .map((o) => ({
          id: o.orderId,
          type: "order" as const,
          title: `New Order: ${o.orderId}`,
          senderName: o.customerInfo.name,
          preview: `Rs. ${o.totalAmount.toLocaleString()} • ${o.items.length} item(s) • ${o.customerInfo.district}`,
          time: new Date(o.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          rawDate: o.createdAt,
          link: "/admin/orders",
        }));

      // Combine & sort by date descending
      const combined = [...unreadMsgs, ...unreadOrders].sort(
        (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
      );

      setNotifications(combined);
    } catch (e) {
      console.error(e);
    }
  };

  // Load and poll notifications
  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalRevenue = orders
    .filter((o) => o.orderStatus === "Completed" || o.orderStatus === "Dispatched")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const unreadCount = notifications.length;

  const markAllRead = () => {
    try {
      // 1. Mark all messages read
      markAllMessagesRead();

      // 2. Mark all orders read
      const allOrderIds = orders.map((o) => o.orderId);
      localStorage.setItem(READ_ORDERS_KEY, JSON.stringify(allOrderIds));

      setNotifications([]);
      setNotifOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const dismissNotif = (notif: NotificationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      if (notif.type === "message") {
        markMessageRead(notif.id);
      } else if (notif.type === "order") {
        const readOrderIdsStr = localStorage.getItem(READ_ORDERS_KEY);
        const readOrderIds: string[] = readOrderIdsStr ? JSON.parse(readOrderIdsStr) : [];
        if (!readOrderIds.includes(notif.id)) {
          readOrderIds.push(notif.id);
          localStorage.setItem(READ_ORDERS_KEY, JSON.stringify(readOrderIds));
        }
      }
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    dismissNotif(notif);
    setNotifOpen(false);
    router.push(notif.link);
  };

  return (
    <header className="w-full bg-white border-b border-slate-100 px-3 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left: Mobile Toggle & Brand Identity */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
          aria-label="Open Admin Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-xs border border-slate-100 bg-white flex items-center justify-center shrink-0">
            <Image
              src="/images/logo.png"
              alt="MIKI Baby SL Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain p-0.5"
              priority
            />
          </div>
          <div>
            <span className="font-heading font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight block">
              MIKI BABY SL
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:block">
              Operations Control Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Quick Stats, Role Switcher & User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Revenue Badge */}
        <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{formatPrice(totalRevenue || 21720)}</span>
        </div>

        {/* Interactive TEST ROLE Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1 sm:gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="hidden sm:inline">TEST ROLE:</span>
            <span className="capitalize text-slate-900">
              {adminUser?.role === "owner" ? "Owner" : "Staff"}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${roleDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Role Dropdown Menu */}
          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-lg py-1.5 z-50 text-xs">
              <button
                type="button"
                onClick={() => { switchRole("owner"); setRoleDropdownOpen(false); }}
                className="w-full px-4 py-2.5 text-left flex items-center justify-between text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
              >
                <span>👑 Owner / Super Admin</span>
                {adminUser?.role === "owner" && <Check className="w-4 h-4 text-miki-pink" />}
              </button>

              <button
                type="button"
                onClick={() => { switchRole("staff"); setRoleDropdownOpen(false); }}
                className="w-full px-4 py-2.5 text-left flex items-center justify-between text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
              >
                <span>👤 Staff Operator</span>
                {adminUser?.role === "staff" && <Check className="w-4 h-4 text-miki-pink" />}
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell with Dropdown Panel */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-auto sm:mt-2 w-[calc(100vw-1rem)] sm:w-84 max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-extrabold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-[11px] text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      All read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification Items */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className="px-4 py-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 group"
                    >
                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          notif.type === "order"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                            : "bg-rose-50 border-rose-100 text-miki-pink"
                        }`}
                      >
                        {notif.type === "order" ? (
                          <OrderBagIcon className="w-4 h-4" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-extrabold text-slate-900 leading-tight group-hover:text-miki-pink transition-colors">
                            {notif.title}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => dismissNotif(notif, e)}
                            title="Dismiss notification"
                            className="text-slate-300 hover:text-slate-600 cursor-pointer shrink-0 mt-0.5 p-0.5 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{notif.time}</p>
                        <p className="text-[11px] font-semibold text-slate-700 mt-1">
                          {notif.senderName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {notif.preview}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer: Quick Links */}
              <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50/50 flex items-center justify-between text-xs font-bold">
                <Link
                  href="/admin/orders"
                  onClick={() => setNotifOpen(false)}
                  className="text-slate-600 hover:text-miki-pink transition-colors"
                >
                  📦 View Orders
                </Link>
                <Link
                  href="/admin/messages"
                  onClick={() => setNotifOpen(false)}
                  className="text-slate-600 hover:text-miki-pink transition-colors"
                >
                  💬 View Messages
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-1 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-miki-pink text-white font-black text-xs flex items-center justify-center shadow-md">
            {adminUser?.name.charAt(0) || "M"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">{adminUser?.name || "Miki Owner"}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              {adminUser?.role === "owner" ? "OWNER" : "STAFF"}
            </p>
          </div>
        </div>

        {/* Logout Quick Icon */}
        <button
          type="button"
          onClick={logout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
