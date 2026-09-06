"use client";

import React, { useState } from "react";
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Ruler,
  Tag,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useStore } from "@/context/StoreContext";
import { Category, FrameSize } from "@/types";
import { logAdminAction } from "@/lib/auditDb";

type Tab = "categories" | "frameSizes";

export default function MasterDataPage() {
  const { adminUser, hasPermission } = useAdminAuth();
  const {
    categories,
    frameSizes,
    addCategory,
    updateCategory,
    deleteCategory,
    addFrameSize,
    updateFrameSize,
    deleteFrameSize,
  } = useStore();

  const [activeTab, setActiveTab] = useState<Tab>("categories");

  // ── Category Form State ──
  const [catFormOpen, setCatFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catOrder, setCatOrder] = useState(1);
  const [catStatus, setCatStatus] = useState<"active" | "inactive">("active");

  // ── Frame Size Form State ──
  const [fsFormOpen, setFsFormOpen] = useState(false);
  const [editingFs, setEditingFs] = useState<FrameSize | null>(null);
  const [fsLabel, setFsLabel] = useState("");
  const [fsFrameType, setFsFrameType] = useState("");
  const [fsWidth, setFsWidth] = useState<number | undefined>();
  const [fsHeight, setFsHeight] = useState<number | undefined>();
  const [fsOrder, setFsOrder] = useState(1);
  const [fsStatus, setFsStatus] = useState<"active" | "inactive">("active");

  if (!adminUser) return null;
  if (!hasPermission("products")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="p-10 text-rose-400 font-bold">
            Access Denied: You do not have permission to manage master data.
          </div>
        </div>
      </div>
    );
  }

  // ── Category Handlers ──
  const openAddCat = () => {
    setEditingCat(null);
    setCatName("");
    setCatSlug("");
    setCatDesc("");
    setCatOrder(categories.length + 1);
    setCatStatus("active");
    setCatFormOpen(true);
  };

  const openEditCat = (cat: Category) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description || "");
    setCatOrder(cat.displayOrder);
    setCatStatus(cat.status);
    setCatFormOpen(true);
  };

  const saveCat = () => {
    if (!catName.trim()) return;
    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (editingCat) {
      updateCategory(editingCat.categoryId, {
        name: catName.trim(),
        slug,
        description: catDesc.trim() || undefined,
        displayOrder: catOrder,
        status: catStatus,
      });
      if (adminUser) {
        logAdminAction({
          action: "CATEGORY_UPDATED",
          adminName: adminUser.name,
          adminEmail: adminUser.email,
          adminRole: adminUser.role,
          targetType: "category",
          targetId: editingCat.categoryId,
          targetName: catName.trim(),
          details: `Updated category "${catName.trim()}".`,
        });
      }
    } else {
      addCategory({
        name: catName.trim(),
        slug,
        description: catDesc.trim() || undefined,
        displayOrder: catOrder,
        status: catStatus,
      });
      if (adminUser) {
        logAdminAction({
          action: "CATEGORY_CREATED",
          adminName: adminUser.name,
          adminEmail: adminUser.email,
          adminRole: adminUser.role,
          targetType: "category",
          targetId: slug,
          targetName: catName.trim(),
          details: `Created new master category "${catName.trim()}".`,
        });
      }
    }
    setCatFormOpen(false);
  };

  const handleDeleteCat = (cat: Category) => {
    if (confirm(`Delete category "${cat.name}"? This cannot be undone.`)) {
      deleteCategory(cat.categoryId);
      if (adminUser) {
        logAdminAction({
          action: "CATEGORY_DELETED",
          adminName: adminUser.name,
          adminEmail: adminUser.email,
          adminRole: adminUser.role,
          targetType: "category",
          targetId: cat.categoryId,
          targetName: cat.name,
          details: `Deleted master category "${cat.name}".`,
        });
      }
    }
  };

  // ── Frame Size Handlers ──
  const openAddFs = () => {
    setEditingFs(null);
    setFsLabel("");
    setFsFrameType("");
    setFsWidth(undefined);
    setFsHeight(undefined);
    setFsOrder(frameSizes.length + 1);
    setFsStatus("active");
    setFsFormOpen(true);
  };

  const openEditFs = (fs: FrameSize) => {
    setEditingFs(fs);
    setFsLabel(fs.label);
    setFsFrameType(fs.frameType);
    setFsWidth(fs.widthMm);
    setFsHeight(fs.heightMm);
    setFsOrder(fs.displayOrder);
    setFsStatus(fs.status);
    setFsFormOpen(true);
  };

  const saveFs = () => {
    if (!fsLabel.trim()) return;
    if (editingFs) {
      updateFrameSize(editingFs.id, {
        label: fsLabel.trim(),
        frameType: fsFrameType.trim(),
        widthMm: fsWidth,
        heightMm: fsHeight,
        displayOrder: fsOrder,
        status: fsStatus,
      });
      if (adminUser) {
        logAdminAction({
          action: "FRAME_SIZE_UPDATED",
          adminName: adminUser.name,
          adminEmail: adminUser.email,
          adminRole: adminUser.role,
          targetType: "frame_size",
          targetId: editingFs.id,
          targetName: fsLabel.trim(),
          details: `Updated frame size "${fsLabel.trim()}".`,
        });
      }
    } else {
      addFrameSize({
        label: fsLabel.trim(),
        frameType: fsFrameType.trim(),
        widthMm: fsWidth,
        heightMm: fsHeight,
        displayOrder: fsOrder,
        status: fsStatus,
      });
      if (adminUser) {
        logAdminAction({
          action: "FRAME_SIZE_CREATED",
          adminName: adminUser.name,
          adminEmail: adminUser.email,
          adminRole: adminUser.role,
          targetType: "frame_size",
          targetId: `fs-${Date.now()}`,
          targetName: fsLabel.trim(),
          details: `Created new master frame size "${fsLabel.trim()}" (${fsFrameType.trim()}).`,
        });
      }
    }
    setFsFormOpen(false);
  };

  const handleDeleteFs = (fs: FrameSize) => {
    if (confirm(`Delete frame size "${fs.label}"? This cannot be undone.`)) {
      deleteFrameSize(fs.id);
      if (adminUser) {
        logAdminAction({
          action: "FRAME_SIZE_DELETED",
          adminName: adminUser.name,
          adminEmail: adminUser.email,
          adminRole: adminUser.role,
          targetType: "frame_size",
          targetId: fs.id,
          targetName: fs.label,
          details: `Deleted master frame size "${fs.label}".`,
        });
      }
    }
  };

  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
  const sortedFrameSizes = [...frameSizes].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-10 space-y-6 overflow-y-auto w-full max-w-full min-w-0 max-h-[calc(100vh-61px)]">
          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <FolderTree className="w-5 h-5 sm:w-6 sm:h-6 text-miki-pink" /> Master Data
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage product categories, frame sizes, and other system configuration data.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "categories"
                  ? "bg-miki-pink text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Tag className="w-4 h-4" /> Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab("frameSizes")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "frameSizes"
                  ? "bg-miki-pink text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Ruler className="w-4 h-4" /> Frame Sizes ({frameSizes.length})
            </button>
          </div>

          {/* ── CATEGORIES TAB ── */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">
                  {sortedCategories.length} Categories
                </span>
                <button
                  onClick={openAddCat}
                  className="bg-miki-pink hover:bg-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              {/* Category Form Modal */}
              {catFormOpen && (
                <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800">
                      {editingCat ? "Edit Category" : "New Category"}
                    </h3>
                    <button onClick={() => setCatFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Name *</label>
                      <input
                        type="text"
                        value={catName}
                        onChange={(e) => {
                          setCatName(e.target.value);
                          if (!editingCat) {
                            setCatSlug(
                              e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                            );
                          }
                        }}
                        placeholder="e.g. Baby Room Wall Art"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Slug</label>
                      <input
                        type="text"
                        value={catSlug}
                        onChange={(e) => setCatSlug(e.target.value)}
                        placeholder="auto-generated"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-600 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={catDesc}
                        onChange={(e) => setCatDesc(e.target.value)}
                        placeholder="Optional description..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Display Order</label>
                      <input
                        type="number"
                        min={1}
                        value={catOrder}
                        onChange={(e) => setCatOrder(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Status</label>
                      <select
                        value={catStatus}
                        onChange={(e) => setCatStatus(e.target.value as "active" | "inactive")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setCatFormOpen(false)}
                      className="bg-slate-100 text-slate-600 font-semibold px-4 py-2 rounded-xl hover:bg-slate-200 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveCat}
                      className="bg-miki-pink hover:bg-rose-500 text-white font-bold px-5 py-2 rounded-xl shadow-md flex items-center gap-1 text-xs"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                </div>
              )}

              {/* Category Table */}
              <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="p-4">#</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Slug</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedCategories.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                            No categories yet. Click "Add Category" to create one.
                          </td>
                        </tr>
                      ) : (
                        sortedCategories.map((cat) => (
                          <tr key={cat.categoryId} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-4 font-mono text-slate-400">{cat.displayOrder}</td>
                            <td className="p-4 font-bold text-slate-900">{cat.name}</td>
                            <td className="p-4 text-slate-500 font-mono">{cat.slug}</td>
                            <td className="p-4 text-slate-500 max-w-[200px] truncate">
                              {cat.description || "—"}
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                  cat.status === "active"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-slate-100 text-slate-500 border border-slate-200"
                                }`}
                              >
                                {cat.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditCat(cat)}
                                  className="bg-white hover:bg-slate-50 text-slate-700 p-2 rounded-lg border border-slate-200 shadow-xs cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCat(cat)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg border border-rose-200 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── FRAME SIZES TAB ── */}
          {activeTab === "frameSizes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">
                  {sortedFrameSizes.length} Frame Sizes
                </span>
                <button
                  onClick={openAddFs}
                  className="bg-miki-pink hover:bg-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Frame Size
                </button>
              </div>

              {/* Frame Size Form */}
              {fsFormOpen && (
                <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800">
                      {editingFs ? "Edit Frame Size" : "New Frame Size"}
                    </h3>
                    <button onClick={() => setFsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Label *</label>
                      <input
                        type="text"
                        value={fsLabel}
                        onChange={(e) => setFsLabel(e.target.value)}
                        placeholder="e.g. A4 (21 x 29.7 cm)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Frame Type *</label>
                      <input
                        type="text"
                        value={fsFrameType}
                        onChange={(e) => setFsFrameType(e.target.value)}
                        placeholder="e.g. Wall Art Frame"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Width (mm)</label>
                      <input
                        type="number"
                        min={0}
                        value={fsWidth ?? ""}
                        onChange={(e) => setFsWidth(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="e.g. 210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Height (mm)</label>
                      <input
                        type="number"
                        min={0}
                        value={fsHeight ?? ""}
                        onChange={(e) => setFsHeight(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="e.g. 297"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Display Order</label>
                      <input
                        type="number"
                        min={1}
                        value={fsOrder}
                        onChange={(e) => setFsOrder(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Status</label>
                      <select
                        value={fsStatus}
                        onChange={(e) => setFsStatus(e.target.value as "active" | "inactive")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setFsFormOpen(false)}
                      className="bg-slate-100 text-slate-600 font-semibold px-4 py-2 rounded-xl hover:bg-slate-200 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveFs}
                      className="bg-miki-pink hover:bg-rose-500 text-white font-bold px-5 py-2 rounded-xl shadow-md flex items-center gap-1 text-xs"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                </div>
              )}

              {/* Frame Size Table */}
              <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="p-4">#</th>
                        <th className="p-4">Label</th>
                        <th className="p-4">Frame Type</th>
                        <th className="p-4">Dimensions (mm)</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedFrameSizes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                            No frame sizes yet. Click "Add Frame Size" to create one.
                          </td>
                        </tr>
                      ) : (
                        sortedFrameSizes.map((fs) => (
                          <tr key={fs.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-4 font-mono text-slate-400">{fs.displayOrder}</td>
                            <td className="p-4 font-bold text-slate-900">{fs.label}</td>
                            <td className="p-4 text-slate-700">{fs.frameType}</td>
                            <td className="p-4 text-slate-500 font-mono">
                              {fs.widthMm && fs.heightMm
                                ? `${fs.widthMm} × ${fs.heightMm}`
                                : "—"}
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                  fs.status === "active"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-slate-100 text-slate-500 border border-slate-200"
                                }`}
                              >
                                {fs.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditFs(fs)}
                                  className="bg-white hover:bg-slate-50 text-slate-700 p-2 rounded-lg border border-slate-200 shadow-xs cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteFs(fs)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg border border-rose-200 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
