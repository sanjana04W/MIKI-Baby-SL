"use client";

import React, { useState } from "react";
import { X, Save, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/context/StoreContext";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct, categories } = useStore();

  const [name, setName] = useState(product?.name || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.categoryId || "cat-wall-art");
  const [description, setDescription] = useState(product?.description || "");
  const [dimensions, setDimensions] = useState(product?.dimensions || "A4 (21 x 29.7 cm)");
  const [material, setMaterial] = useState(product?.material || "Premium Matte Art Paper & Pine Frame");
  const [basePrice, setBasePrice] = useState<number>(product?.basePrice || 3500);
  const [salePrice, setSalePrice] = useState<number | undefined>(product?.salePrice);
  const [stockLevel, setStockLevel] = useState<number>(product?.stockLevel || 10);
  const [isFeatured, setIsFeatured] = useState<boolean>(product?.isFeatured || false);
  const [isNewArrival, setIsNewArrival] = useState<boolean>(product?.isNewArrival || true);
  const [status, setStatus] = useState<"active" | "archived">(product?.status || "active");

  const [images, setImages] = useState<string[]>(
    product?.images || [
      "/images/661247360_122186257130624717_6303554255591935628_n.jpg",
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

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
      images: images.length > 0 ? images : ["/images/661247360_122186257130624717_6303554255591935628_n.jpg"],
      isFeatured,
      isNewArrival,
      status,
      stockStatus: Number(stockLevel) <= 0 ? "out_of_stock" as const : Number(stockLevel) <= 5 ? "low_stock" as const : "in_stock" as const,
    };

    if (product) {
      updateProduct(product.productId, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-miki-cream sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-800">
            {product ? "Edit Product" : "Add New Wall Art / Gift"}
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
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
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
                value={stockLevel}
                onChange={(e) => setStockLevel(Number(e.target.value))}
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

          <div className="flex items-center gap-6 pt-2">
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
          </div>

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
                  placeholder="e.g. /images/661247360_122186257130624717_6303554255591935628_n.jpg"
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
