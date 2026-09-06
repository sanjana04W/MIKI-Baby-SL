"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Trash2,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AuditLog, AuditAction } from "@/types";
import { getAuditLogs, clearAuditLogs } from "@/lib/auditDb";

const ALL_ACTIONS: AuditAction[] = [
  "PRODUCT_CREATED",
  "PRODUCT_UPDATED",
  "PRODUCT_DELETED",
  "VARIANT_ADDED",
  "VARIANT_UPDATED",
  "VARIANT_DELETED",
  "STOCK_ADJUSTED",
  "FEATURED_TOGGLED",
  "CATEGORY_CREATED",
  "CATEGORY_UPDATED",
  "CATEGORY_DELETED",
  "FRAME_SIZE_CREATED",
  "FRAME_SIZE_UPDATED",
  "FRAME_SIZE_DELETED",
  "SETTINGS_UPDATED",
];

const TARGET_TYPES = ["product", "category", "frame_size", "inventory", "settings"] as const;

function getActionColor(action: string): string {
  if (action.includes("CREATED")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (action.includes("UPDATED")) return "bg-sky-50 text-sky-700 border-sky-200";
  if (action.includes("DELETED")) return "bg-rose-50 text-rose-700 border-rose-200";
  if (action.includes("TOGGLED") || action.includes("ADJUSTED"))
    return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
      " " +
      d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function AuditLogsPage() {
  const { adminUser } = useAdminAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  if (!adminUser) return null;
  if (adminUser.role !== "owner") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="p-10 text-rose-400 font-bold">
            Access Denied: Only owners can view audit logs.
          </div>
        </div>
      </div>
    );
  }

  const filteredLogs = logs
    .filter((log) => {
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      const matchesTarget = targetFilter === "all" || log.targetType === targetFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.performedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAction && matchesTarget && matchesSearch;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredLogs.length);
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all audit logs? This cannot be undone.")) {
      clearAuditLogs();
      setLogs([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-10 space-y-6 overflow-y-auto w-full max-w-full min-w-0 max-h-[calc(100vh-61px)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 sm:w-6 sm:h-6 text-miki-pink" /> Audit Logs
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Track all product-related changes with timestamps and user attribution.
              </p>
            </div>
            <button
              onClick={handleClearLogs}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Clear All Logs
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by target, user, or details..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-miki-pink"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-miki-pink"
              >
                <option value="all">All Actions</option>
                {ALL_ACTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <select
                value={targetFilter}
                onChange={(e) => {
                  setTargetFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-miki-pink"
              >
                <option value="all">All Targets</option>
                {TARGET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Logs Table */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Performed By</th>
                    <th className="p-4">Target</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                        {filteredLogs.length === 0 && logs.length === 0
                          ? "No audit logs recorded yet."
                          : "No logs match the current filters."}
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 text-slate-500 text-[11px] font-mono whitespace-nowrap">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${getActionColor(
                              log.action
                            )}`}
                          >
                            {log.action.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-slate-800">{log.performedBy.name}</p>
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                log.performedBy.role === "owner"
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {log.performedBy.role}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                              {log.targetType.replace(/_/g, " ")}
                            </span>
                            <p className="font-semibold text-slate-700 line-clamp-1">
                              {log.targetName}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 max-w-[250px]">
                          <p className="line-clamp-2">{log.details}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredLogs.length > 0 && (
              <div className="flex items-center justify-between p-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  Showing {startIndex + 1}–{endIndex} of {filteredLogs.length} entries
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage(safePage - 1)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((pg) => pg === 1 || pg === totalPages || Math.abs(pg - safePage) <= 1)
                    .map((pg, idx, arr) => (
                      <React.Fragment key={pg}>
                        {idx > 0 && arr[idx - 1] !== pg - 1 && (
                          <span className="px-1 text-slate-300 text-xs">…</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(pg)}
                          className={`min-w-[32px] h-8 rounded-lg text-xs font-bold cursor-pointer ${
                            pg === safePage
                              ? "bg-miki-pink text-white shadow"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {pg}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage(safePage + 1)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
