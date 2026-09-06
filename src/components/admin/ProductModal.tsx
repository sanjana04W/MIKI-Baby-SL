"use client";

import React, { useState } from "react";
import { X, Save, Plus, Trash2, Layers } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { useStore } from "@/context/StoreContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { logAdminAction } from "@/lib/auditDb";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { adminUser } = useAdminAuth();
  const { addProduct, updateProduct, categories } = useStore();

  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.categoryId || "");
  const [description, setDescription] = useState(product?.description || "");
  const [dimensions, setDimensions] = useState(product?.dimensions || "");
  const [material, setMaterial] = useState(product?.material || "");
  const [basePrice, setBasePrice] = useState<number>(product?.basePrice || 0);
  const [salePrice, setSalePrice] = useState<number | undefined>(product?.salePrice);
  const [stockLevel, setStockLevel] = useState<number>(product?.stockLevel || 0);
  const [isFeatured, setIsFeatured] = useState<boolean>(product?.isFeatured || false);
  const [isNewArrival, setIsNewArrival] = useState<boolean>(product?.isNewArrival || false);
  const [isPersonalizable, setIsPersonalizable] = useState<boolean>(product?.isPersonalizable || false);
  const [personalizationFields, setPersonalizationFields] = useState<string>(
    product?.personalizationFields?.join(", ") || ""
  );
  const [status, setStatus] = useState<"active" | "archived">(product?.status || "active");

  const [images, setImages] = useState<string[]>(product?.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Variant management
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || []);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: `v-${Date.now()}`, name: "", price: 0, stock: 0 },
    ]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const validVariants = variants.filter((v) => v.name.trim());

    const payload = {
      name,
      slug,
      categoryId,
      description,
      dimensions,
      material,
      basePrice: Number(basePrice),
      salePrice: salePrice ? Number(salePrice) : undefined,
      stockLevel: Number(stockLevel),
      images: images.length > 0 ? images : [],
      isFeatured,
      isNewArrival,
      isPersonalizable,
      personalizationFields: isPersonalizable
        ? personalizationFields.split(",").map((f) => f.trim()).filter(Boolean)
        : undefined,
      status,
      variants: validVariants.length > 0 ? validVariants : undefined,
      stockStatus:
        Number(stockLevel) <= 0
          ? ("out_of_stock" as const)
          : Number(stockLevel) <= 5
          ? ("low_stock" as const)
          : ("in_stock" as const),
    };

    if (product) {
      updateProduct(product.productId, payload);
      if (adminUser) {
        logAdminAction({
          action: "PRODUCT_UPDATED",
          adminName: adminUser.name,
          adminEmail: adminUser.email,
          adminRole: adminUser.role,
          targetType: "product",
          targetId: product.productId,
          targetName: payload.name,
          details: `Updated product details and pricing. Variants: ${validVariants.length}.`,
        });
      }
    } else {
      const created = addProduct(payload);
      if (adminUser) {
        logAdminAction({
          action: "PRODUCT_CREATED",
          adminName: adminUser.name,
          adminEmail: adminUser.email,
          adminRole: adminUser.role,
          targetType: "product",
          targetId: created.productId,
          targetName: payload.name,
          details: `Created new product with ${validVariants.length} variant(s).`,
        });
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-miki-cream sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Safari Jungle Animals Nursery Wall Art"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-sm text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
              >
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Catalog Visibility Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "archived")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
              >
                <option value="active">Active (Visible in Storefront)</option>
                <option value="archived">Archived (Hidden from Storefront)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Dimensions / Size</label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. A4 (21 x 29.7 cm)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Material Details</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Premium Canvas & Pine Frame"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Base Price (Rs.) *</label>
              <input
                type="number"
                required
                min={0}
                value={basePrice || ""}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Sale Discount Price (Rs.)</label>
              <input
                type="number"
                min={0}
                value={salePrice || ""}
                onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Optional"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Stock Level Quantity *</label>
              <input
                type="number"
                required
                min={0}
                value={stockLevel || ""}
                onChange={(e) => setStockLevel(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed product story, nursery room pairing ideas..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
            />
          </div>

          {/* ── Product Variants Section ── */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <Layers className="w-4 h-4 text-miki-pink" />
                Product Variants
              </h3>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <p className="text-slate-400 text-xs py-2">
                No variants added. Click "Add Variant" to create options like frame colors or sizes.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-black text-slate-400 uppercase px-1">
                  <span className="col-span-5">Variant Name</span>
                  <span className="col-span-3">Price (Rs.)</span>
                  <span className="col-span-3">Stock</span>
                  <span className="col-span-1"></span>
                </div>
                {variants.map((v, i) => (
                  <div key={v.id} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => handleUpdateVariant(i, "name", e.target.value)}
                      placeholder="e.g. Framed - White Wood"
                      className="col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                    />
                    <input
                      type="number"
                      min={0}
                      value={v.price || ""}
                      onChange={(e) => handleUpdateVariant(i, "price", Number(e.target.value))}
                      placeholder="0"
                      className="col-span-3 bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                    />
                    <input
                      type="number"
                      min={0}
                      value={v.stock || ""}
                      onChange={(e) => handleUpdateVariant(i, "stock", Number(e.target.value))}
                      placeholder="0"
                      className="col-span-3 bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(i)}
                      className="col-span-1 text-slate-400 hover:text-rose-500 p-1 flex justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 pt-2 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-miki-pink focus:ring-miki-pink w-4 h-4"
              />
              <span>Highlight on Homepage Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded text-miki-pink focus:ring-miki-pink w-4 h-4"
              />
              <span>Mark as New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={isPersonalizable}
                onChange={(e) => setIsPersonalizable(e.target.checked)}
                className="rounded text-miki-pink focus:ring-miki-pink w-4 h-4"
              />
              <span>Personalizable</span>
            </label>
          </div>

          {isPersonalizable && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Personalization Fields (comma separated)
              </label>
              <input
                type="text"
                value={personalizationFields}
                onChange={(e) => setPersonalizationFields(e.target.value)}
                placeholder="e.g. Baby Name, Date of Birth, Birth Weight"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Gallery Image Relative Paths (/images/...)</label>
            <div className="space-y-2">
              {images.map((img, i) => (
                <div key={i} className="flex items-center gap-2">
                  <img src={img} alt="Preview" className="w-8 h-8 rounded object-cover bg-slate-100 shrink-0" />
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => {
                      const updated = [...images];
                      updated[i] = e.target.value;
                      setImages(updated);
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="e.g. /images/generated/safari_animals_wall_art.jpg"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="bg-slate-800 text-white px-3 py-2 rounded-xl font-bold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Image
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 text-slate-700 font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-miki-pink hover:bg-miki-rose text-white font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
