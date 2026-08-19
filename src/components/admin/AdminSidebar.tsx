"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Layers,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { getUnreadCount } from "@/lib/adminMessages";

const MESSAGES_KEY = "miki_admin_messages";
const READ_ORDERS_KEY = "miki_read_order_notifications";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { adminUser, logout, hasPermission } = useAdminAuth();
  const { orders } = useStore();

  const isOwner = adminUser?.role === "owner";

  // Dynamic unread badge from shared store — polls every 500ms
  const [messageBadge, setMessageBadge] = useState<number>(0);
  const [orderBadge, setOrderBadge] = useState<number>(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener("miki_toggle_admin_sidebar", handleToggle);
    return () => window.removeEventListener("miki_toggle_admin_sidebar", handleToggle);
  }, []);

  // Close drawer automatically on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const update = () => {
      setMessageBadge(getUnreadCount());
      try {
        const readOrderIdsStr = localStorage.getItem(READ_ORDERS_KEY);
        const readOrderIds: string[] = readOrderIdsStr ? JSON.parse(readOrderIdsStr) : [];
        const readSet = new Set(readOrderIds);
        const unreadOrdersCount = orders.filter((o) => !readSet.has(o.orderId)).length;
        setOrderBadge(unreadOrdersCount);
      } catch {}
    };
    update();
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [orders]);

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      label: "Order Management",
      href: "/admin/orders",
      icon: ShoppingBag,
      show: hasPermission("orders"),
      badge: orderBadge > 0 ? String(orderBadge) : undefined,
    },
    {
      label: "Product Catalog",
      href: "/admin/products",
      icon: Package,
      show: hasPermission("products"),
    },
    {
      label: "Stock & Inventory",
      href: "/admin/inventory",
      icon: Layers,
      show: hasPermission("inventory"),
    },
    {
      label: "Promotions & Offers",
      href: "/admin/promotions",
      icon: Tag,
      show: isOwner || hasPermission("products"),
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      show: isOwner || hasPermission("analytics"),
    },
    {
      label: "User Management",
      href: "/admin/staff",
      icon: Users,
      show: isOwner,
    },
    {
      label: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      show: true,
      badge: messageBadge > 0 ? String(messageBadge) : undefined,
    },
    {
      label: "System Settings",
      href: "/admin/settings",
      icon: Settings,
      show: isOwner,
    },
  ];

  const sidebarContent = (
    <>
      <div className="space-y-4">
        {/* Mobile Header with Close Button */}
        <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-black text-slate-900 tracking-tight">Admin Menu</span>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Label */}
        <div className="px-3 pt-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            NAVIGATION
          </span>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-rose-50 text-miki-pink font-bold border border-rose-100 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-miki-pink" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Bottom Access Badges & Actions */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        {/* Role Badge */}
        <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-miki-pink shrink-0" />
          <span className="truncate uppercase text-[11px] tracking-wide">
            {isOwner ? "FULL OWNER ACCESS" : "STAFF OPERATOR ACCESS"}
          </span>
        </div>

        {/* Visit Online Store */}
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-colors border border-slate-200"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Visit Online Store</span>
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-bold py-2.5 rounded-xl transition-colors border border-slate-200 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white text-slate-600 flex-col justify-between h-[calc(100vh-61px)] sticky top-[61px] border-r border-slate-100 shrink-0 p-4 shadow-sm">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Sidebar */}
          <aside className="relative w-72 max-w-[85vw] bg-white text-slate-600 flex flex-col justify-between h-full p-4 shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
