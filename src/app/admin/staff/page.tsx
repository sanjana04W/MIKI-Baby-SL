"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Eye,
  Power,
  Pencil,
  Trash2,
  X,
  ShoppingCart,
  Package,
  User,
  BarChart2,
  Settings,
  CheckSquare,
  Square,
  Search,
  MessageCircle,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice, formatDate } from "@/lib/utils";
import { AdminUser, CustomerUser } from "@/types";

// Extended granular permissions model
interface GranularPermissions {
  // Orders
  viewOrders: boolean;
  updateOrderStatus: boolean;
  contactCustomersWhatsApp: boolean;
  // Products & Inventory
  viewProducts: boolean;
  addNewProducts: boolean;
  editExistingProducts: boolean;
  deleteProducts: boolean;
  manageStockInventory: boolean;
  // Customers
  viewCustomerProfiles: boolean;
  // Analytics
  viewAnalyticsRevenue: boolean;
  viewSalesReports: boolean;
  // Settings
  systemSettings: boolean;
  promotionsDiscounts: boolean;
  pixelIntegrations: boolean;
}

const ALL_PERMISSIONS: GranularPermissions = {
  viewOrders: true,
  updateOrderStatus: true,
  contactCustomersWhatsApp: true,
  viewProducts: true,
  addNewProducts: true,
  editExistingProducts: true,
  deleteProducts: true,
  manageStockInventory: true,
  viewCustomerProfiles: true,
  viewAnalyticsRevenue: true,
  viewSalesReports: true,
  systemSettings: true,
  promotionsDiscounts: true,
  pixelIntegrations: true,
};

const NO_PERMISSIONS: GranularPermissions = {
  viewOrders: false,
  updateOrderStatus: false,
  contactCustomersWhatsApp: false,
  viewProducts: false,
  addNewProducts: false,
  editExistingProducts: false,
  deleteProducts: false,
  manageStockInventory: false,
  viewCustomerProfiles: false,
  viewAnalyticsRevenue: false,
  viewSalesReports: false,
  systemSettings: false,
  promotionsDiscounts: false,
  pixelIntegrations: false,
};

const STAFF_PERMISSIONS: GranularPermissions = {
  viewOrders: true,
  updateOrderStatus: true,
  contactCustomersWhatsApp: true,
  viewProducts: true,
  addNewProducts: false,
  editExistingProducts: true,
  deleteProducts: false,
  manageStockInventory: true,
  viewCustomerProfiles: true,
  viewAnalyticsRevenue: false,
  viewSalesReports: false,
  systemSettings: false,
  promotionsDiscounts: false,
  pixelIntegrations: false,
};

const countSelected = (perms: GranularPermissions) =>
  Object.values(perms).filter(Boolean).length;

interface StaffMember {
  uid: string;
  name: string;
  email: string;
  role: "owner" | "staff";
  isActive: boolean;
  permissions: GranularPermissions;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    uid: "owner-001",
    name: "MIKI Owner",
    email: "owner@mikibaby.lk",
    role: "owner",
    isActive: true,
    permissions: { ...ALL_PERMISSIONS },
  },
  {
    uid: "staff-001",
    name: "MIKI Staff",
    email: "staff@mikibaby.lk",
    role: "staff",
    isActive: true,
    permissions: { ...STAFF_PERMISSIONS },
  },
];

interface EditModalProps {
  member: StaffMember;
  onClose: () => void;
  onSave: (updated: StaffMember) => void;
}

function EditStaffModal({ member, onClose, onSave }: EditModalProps) {
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email);
  const [role, setRole] = useState<"owner" | "staff">(member.role);
  const [isActive, setIsActive] = useState(member.isActive);
  const [perms, setPerms] = useState<GranularPermissions>({ ...member.permissions });

  const handleRoleChange = (newRole: "owner" | "staff") => {
    setRole(newRole);
    if (newRole === "owner") {
      setPerms({ ...ALL_PERMISSIONS });
    } else {
      setPerms({ ...STAFF_PERMISSIONS });
    }
  };

  const togglePerm = (key: keyof GranularPermissions) => {
    setPerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = () => setPerms({ ...ALL_PERMISSIONS });
  const clearAll = () => setPerms({ ...NO_PERMISSIONS });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...member, name, email, role, isActive, permissions: perms });
    onClose();
  };

  const permGroups = [
    {
      label: "ORDERS",
      icon: <ShoppingCart className="w-4 h-4" />,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      keys: [
        { key: "viewOrders" as const, label: "View Orders" },
        { key: "updateOrderStatus" as const, label: "Update Order Status" },
        { key: "contactCustomersWhatsApp" as const, label: "Contact Customers via WhatsApp" },
      ],
    },
    {
      label: "PRODUCTS & INVENTORY",
      icon: <Package className="w-4 h-4" />,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
      keys: [
        { key: "viewProducts" as const, label: "View Products" },
        { key: "addNewProducts" as const, label: "Add New Products" },
        { key: "editExistingProducts" as const, label: "Edit Existing Products" },
        { key: "deleteProducts" as const, label: "Delete Products" },
        { key: "manageStockInventory" as const, label: "Manage Stock & Inventory" },
      ],
    },
    {
      label: "CUSTOMERS",
      icon: <User className="w-4 h-4" />,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      keys: [
        { key: "viewCustomerProfiles" as const, label: "View Customer Profiles" },
      ],
    },
    {
      label: "ANALYTICS",
      icon: <BarChart2 className="w-4 h-4" />,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      keys: [
        { key: "viewAnalyticsRevenue" as const, label: "View Analytics & Revenue" },
        { key: "viewSalesReports" as const, label: "View Sales Reports" },
      ],
    },
    {
      label: "SETTINGS",
      icon: <Settings className="w-4 h-4" />,
      color: "text-slate-400",
      bg: "bg-slate-500/10",
      keys: [
        { key: "systemSettings" as const, label: "System Settings" },
        { key: "promotionsDiscounts" as const, label: "Promotions & Discounts" },
        { key: "pixelIntegrations" as const, label: "Pixel & Integrations" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-7 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Edit Staff Member</h2>
            <p className="text-xs text-slate-400 mt-1">Assign a role and choose individual permissions.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="px-7 pb-7 space-y-6">
          {/* Name & Email */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          {/* Account Status Toggle */}
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-slate-900">Account Status</p>
              <p className="text-xs text-slate-400 mt-0.5">Inactive accounts cannot access the admin panel.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors cursor-pointer ${isActive ? "bg-emerald-500" : "bg-slate-300"}`}
            >
              <span
                className={`inline-block w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-700">
              Role <span className="text-rose-500">*</span>{" "}
              <span className="text-xs font-normal text-slate-400">— Selecting a role pre-fills recommended permissions</span>
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("staff")}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  role === "staff"
                    ? "border-rose-500 bg-rose-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${role === "staff" ? "border-rose-500" : "border-slate-300"}`}>
                    {role === "staff" && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">Staff</span>
                </div>
                <p className="text-xs text-slate-400 pl-6">Standard staff access for everyday operations.</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("owner")}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  role === "owner"
                    ? "border-rose-500 bg-rose-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${role === "owner" ? "border-rose-500" : "border-slate-300"}`}>
                    {role === "owner" && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">Super Admin</span>
                </div>
                <p className="text-xs text-slate-400 pl-6">Full unrestricted access to all features.</p>
              </button>
            </div>
          </div>

          {/* Access Permissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-900">Access Permissions</p>
              <div className="flex items-center gap-2 text-xs">
                <button type="button" onClick={selectAll} className="text-rose-500 font-bold hover:text-rose-600 cursor-pointer">
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button type="button" onClick={clearAll} className="text-slate-500 font-bold hover:text-slate-700 cursor-pointer">
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {permGroups.map((group) => {
                const groupSelected = group.keys.filter((k) => perms[k.key]).length;
                const groupTotal = group.keys.length;
                const allGroupSelected = groupSelected === groupTotal;

                const toggleGroup = () => {
                  if (allGroupSelected) {
                    const updated = { ...perms };
                    group.keys.forEach((k) => { updated[k.key] = false; });
                    setPerms(updated);
                  } else {
                    const updated = { ...perms };
                    group.keys.forEach((k) => { updated[k.key] = true; });
                    setPerms(updated);
                  }
                };

                return (
                  <div key={group.label} className={`rounded-2xl border border-slate-200 overflow-hidden ${group.bg}`}>
                    {/* Group Header */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className={`flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider ${group.color}`}>
                        {group.icon}
                        <span>{group.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {groupSelected}/{groupTotal} selected
                        </span>
                        <button
                          type="button"
                          onClick={toggleGroup}
                          className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors ${allGroupSelected ? "bg-blue-600 text-white" : "bg-white border border-slate-300"}`}
                        >
                          {allGroupSelected && <CheckSquare className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Permission Items */}
                    <div className="bg-white px-4 py-2 space-y-2">
                      {group.keys.map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-3 py-1.5 cursor-pointer">
                          <button
                            type="button"
                            onClick={() => togglePerm(key)}
                            className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors cursor-pointer ${perms[key] ? "bg-rose-500 text-white" : "bg-white border-2 border-slate-300"}`}
                          >
                            {perms[key] && <span className="text-[10px] font-black">✓</span>}
                          </button>
                          <span className="text-sm text-slate-800 font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs px-8 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>✓</span>
              <span>SAVE CHANGES</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminStaffPage() {
  const router = useRouter();
  const { adminUser } = useAdminAuth();
  const { orders } = useStore();
  const [activeTab, setActiveTab] = useState<"staff" | "customers">("staff");
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Customer Management State
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");

  useEffect(() => {
    // Load from local storage immediately for fast render
    try {
      const stored = localStorage.getItem("miki_customer_users");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCustomers(parsed);
        }
      }
    } catch {}

    // Fetch live customer list across all devices from server API
    fetch("/api/auth/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.users)) {
          setCustomers(data.users);
          try {
            localStorage.setItem("miki_customer_users", JSON.stringify(data.users));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  if (!adminUser) return null;

  if (adminUser.role !== "owner") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="p-10 text-rose-400 font-bold">
            Access Denied: Only Super Admin / Owner can manage users.
          </div>
        </div>
      </div>
    );
  }

  const handleSave = (updated: StaffMember) => {
    setStaff((prev) =>
      prev.map((m) => (m.uid === updated.uid ? updated : m))
    );
    setEditingMember(null);
  };

  const handleAddSave = (updated: StaffMember) => {
    setStaff((prev) => [...prev, { ...updated, uid: `staff-${Date.now()}` }]);
    setShowAddModal(false);
  };

  const handleToggleActive = (uid: string) => {
    setStaff((prev) =>
      prev.map((m) => (m.uid === uid ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const handleDelete = (uid: string) => {
    if (confirm("Remove this staff member?")) {
      setStaff((prev) => prev.filter((m) => m.uid !== uid));
    }
  };

  const newMemberTemplate: StaffMember = {
    uid: "new",
    name: "",
    email: "",
    role: "staff",
    isActive: true,
    permissions: { ...STAFF_PERMISSIONS },
  };

  // Filtered customer list
  const filteredCustomers = customers.filter((cust) => {
    if (!customerSearch.trim()) return true;
    const q = customerSearch.toLowerCase();
    return (
      cust.name.toLowerCase().includes(q) ||
      cust.email.toLowerCase().includes(q) ||
      cust.phone.toLowerCase().includes(q) ||
      (cust.address && cust.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 overflow-y-auto w-full max-w-full min-w-0 max-h-[calc(100vh-61px)]">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                User Management
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage backend staff RBAC permissions and view registered storefront customers.
              </p>
            </div>

            {/* Navigation Tabs (Staff vs Customers) */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("staff")}
                className={`justify-center px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "staff"
                    ? "bg-miki-pink text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Backend Staff ({staff.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("customers")}
                className={`justify-center px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "customers"
                    ? "bg-miki-pink text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Registered Customers ({customers.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: BACKEND STAFF MANAGEMENT */}
          {activeTab === "staff" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 space-y-6 shadow-sm animate-in fade-in">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-miki-pink flex items-center justify-center shadow-inner">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Backend Staff Profiles</h2>
                    <p className="text-xs text-slate-500">
                      Manage Role-Based Access Control (RBAC) permissions & staff logins.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ ADD STAFF MEMBER</span>
                </button>
              </div>

              {/* Staff Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 pr-8">MEMBER</th>
                      <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 pr-8">ROLE</th>
                      <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 pr-8">PERMISSIONS</th>
                      <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 pr-8">STATUS</th>
                      <th className="text-right text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {staff.map((member) => (
                      <tr key={member.uid} className="hover:bg-slate-50/70 transition-colors group">
                        {/* Member */}
                        <td className="py-4 pr-8">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-miki-pink flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                              <p className="text-slate-400 text-[11px]">{member.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 pr-8">
                          <span
                            className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${
                              member.role === "owner"
                                ? "bg-rose-50 text-rose-600 border-rose-200"
                                : "bg-sky-50 text-sky-700 border-sky-200"
                            }`}
                          >
                            {member.role === "owner" ? "SUPER ADMIN" : "STAFF"}
                          </span>
                        </td>

                        {/* Permissions Count */}
                        <td className="py-4 pr-8">
                          <span className="font-bold text-slate-800">
                            {member.role === "owner"
                              ? "All permissions"
                              : `${countSelected(member.permissions)} permissions`}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 pr-8">
                          <span
                            className={`text-[10px] font-black px-3 py-1 rounded-full border flex items-center gap-1.5 w-fit ${
                              member.isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${member.isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                            />
                            {member.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              title="View"
                              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              title={member.isActive ? "Deactivate" : "Activate"}
                              onClick={() => handleToggleActive(member.uid)}
                              className={`transition-colors cursor-pointer ${member.isActive ? "text-emerald-600 hover:text-rose-600" : "text-slate-400 hover:text-emerald-600"}`}
                            >
                              <Power className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              title="Edit"
                              onClick={() => setEditingMember(member)}
                              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {member.role !== "owner" && (
                              <button
                                type="button"
                                title="Delete"
                                onClick={() => handleDelete(member.uid)}
                                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTERED CUSTOMERS MANAGEMENT */}
          {activeTab === "customers" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 space-y-6 shadow-sm animate-in fade-in">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Registered Customer Accounts</h2>
                    <p className="text-xs text-slate-500">
                      Real-time synchronized accounts created on the storefront website.
                    </p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search by name, email, phone..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Customers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 pr-6">CUSTOMER</th>
                      <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 pr-6">CONTACT</th>
                      <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 pr-6">DELIVERY ADDRESS</th>
                      <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 pr-6">ORDERS & SPENT</th>
                      <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 pr-6">JOINED</th>
                      <th className="text-right text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3">CONNECT</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                          No registered customer accounts found.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((cust) => {
                        const custOrders = orders.filter(
                          (o) =>
                            o.customerId === cust.id ||
                            (o.customerInfo?.email &&
                                o.customerInfo.email.toLowerCase() === cust.email.toLowerCase())
                        );
                        const custSpent = custOrders.reduce((sum, o) => sum + o.totalAmount, 0);

                        return (
                          <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors group">
                            {/* Customer Avatar & Name */}
                            <td className="py-4 pr-6">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-extrabold text-sm shrink-0">
                                  {cust.name ? cust.name.charAt(0).toUpperCase() : "C"}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 text-sm">{cust.name}</p>
                                  <p className="text-slate-400 text-[11px]">{cust.id}</p>
                                </div>
                              </div>
                            </td>

                            {/* Contact Details */}
                            <td className="py-4 pr-6">
                              <div className="space-y-0.5">
                                <p className="text-slate-700 font-medium flex items-center gap-1.5">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span>{cust.email}</span>
                                </p>
                                {cust.phone && (
                                  <p className="text-slate-400 text-[11px] flex items-center gap-1.5">
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    <span>{cust.phone}</span>
                                  </p>
                                )}
                              </div>
                            </td>

                            {/* Delivery Address */}
                            <td className="py-4 pr-6">
                              <div className="max-w-[220px]">
                                <p className="text-slate-700 truncate font-medium">
                                  {cust.address || "No address saved"}
                                </p>
                                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                  {cust.district || "Colombo"}
                                </span>
                              </div>
                            </td>

                            {/* Orders & Total Spent */}
                            <td className="py-4 pr-6">
                              <div>
                                <span className="font-extrabold text-slate-900">
                                  {custOrders.length} {custOrders.length === 1 ? "order" : "orders"}
                                </span>
                                <p className="text-rose-600 font-bold text-[11px]">
                                  {formatPrice(custSpent)}
                                </p>
                              </div>
                            </td>

                            {/* Joined Date */}
                            <td className="py-4 pr-6 text-slate-400 text-[11px]">
                              {cust.createdAt ? formatDate(cust.createdAt) : "Aug 2026"}
                            </td>

                            {/* Actions / WhatsApp */}
                            <td className="py-4 text-right">
                              {cust.phone ? (
                                <a
                                  href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                    `Hello ${cust.name}, this is MIKI Baby SL. How can we help you with your nursery decor orders?`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              ) : (
                                <span className="text-slate-400 text-[11px]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Staff Modal */}
      {editingMember && (
        <EditStaffModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleSave}
        />
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <EditStaffModal
          member={newMemberTemplate}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddSave}
        />
      )}
    </div>
  );
}

