"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Eye, CheckCircle, AlertTriangle } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { trackAddToCart, trackViewContent } from "@/lib/metaPixel";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();

  const activePrice = product.salePrice || product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    trackViewContent({
      id: product.productId,
      name: product.name,
      price: activePrice,
      category: product.categoryId,
    });
    router.push(`/shop/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.productId,
      name: product.name,
      price: activePrice,
      quantity: 1,
      image: product.images[0],
      dimensions: product.dimensions,
    });
    trackAddToCart({
      id: product.productId,
      name: product.name,
      price: activePrice,
      quantity: 1,
    });
  };

  const handleProductClick = () => {
    trackViewContent({
      id: product.productId,
      name: product.name,
      price: activePrice,
      category: product.categoryId,
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-300 flex flex-col h-full bg-gradient-to-b from-white via-[#FFF9FA] to-[#FFF4F6] cursor-pointer active:scale-[0.98] border border-pink-100/90 w-full"
    >
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
        {hasDiscount && (
          <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm tracking-wide">
            {discountPercent}% OFF
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm tracking-wide">
            NEW
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm tracking-wide">
            ★ BESTSELLER
          </span>
        )}
      </div>

      {/* Image Container with Soft Warm Nursery Studio Aura */}
      <Link
        href={`/shop/${product.slug}`}
        onClick={handleProductClick}
        className="relative aspect-square w-full bg-gradient-to-br from-rose-50/50 via-amber-50/30 to-sky-50/30 overflow-hidden flex items-center justify-center p-2.5 block cursor-pointer shrink-0 border-b border-pink-100/60"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-2 group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-xs"
        />
        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-slate-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
          <span className="bg-white/95 text-slate-900 font-extrabold text-xs px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5 group-hover:scale-105 transition-transform border border-pink-100">
            <Eye className="w-3.5 h-3.5 text-miki-pink" />
            <span>View Details</span>
          </span>
        </div>
      </Link>

      {/* Product Details Card Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5 bg-gradient-to-b from-transparent to-white/80">
        <div>
          {/* Top Meta info */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-medium mb-1.5 gap-1.5">
            <span
              className="truncate max-w-[55%] font-bold text-slate-500 bg-rose-50/80 px-2 py-0.5 rounded-md border border-rose-100/70"
              title={product.dimensions}
            >
              {product.dimensions}
            </span>
            {product.stockStatus === "in_stock" && (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md flex items-center gap-0.5 font-extrabold shrink-0 text-[10px]">
                <CheckCircle className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                <span>In Stock</span>
              </span>
            )}
            {product.stockStatus === "low_stock" && (
              <span className="text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md flex items-center gap-0.5 font-extrabold shrink-0 text-[10px]">
                <AlertTriangle className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                <span>Low Stock</span>
              </span>
            )}
            {product.stockStatus === "out_of_stock" && (
              <span className="text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md font-extrabold shrink-0 text-[10px]">
                Out of Stock
              </span>
            )}
          </div>

          {/* Product Title with Fixed Min-Height for Even Rows */}
          <div className="min-h-[2.4rem] sm:min-h-[2.75rem] flex items-start">
            <Link href={`/shop/${product.slug}`} onClick={handleProductClick} className="block group/link w-full">
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 line-clamp-2 group-hover/link:text-miki-rose group-hover:text-miki-rose transition-colors leading-snug">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>

        {/* Pricing & Add to Cart Action Row */}
        <div className="pt-2.5 border-t border-pink-100/80 flex items-center justify-between gap-1.5 sm:gap-2 mt-auto">
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-base md:text-lg font-black text-slate-900 truncate leading-tight font-heading">
              {formatPrice(activePrice)}
            </div>
            {hasDiscount && (
              <div className="text-[10px] sm:text-xs text-rose-400 font-semibold line-through truncate leading-tight">
                {formatPrice(product.basePrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stockStatus === "out_of_stock"}
            className="bg-gradient-to-r from-miki-pink via-rose-400 to-miki-rose hover:from-miki-rose hover:to-pink-600 disabled:bg-slate-300 text-white h-8 sm:h-9 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm shadow-pink-200/60 cursor-pointer shrink-0 z-10"
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
