"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Eye, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
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
    // If the click originated from an interactive button or nested link, let that handler process it
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
      className="group relative glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card hover:border-miki-pink/40 flex flex-col h-full bg-white cursor-pointer active:scale-[0.98] border border-slate-100"
    >
      {/* Badges Overlay */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 pointer-events-none">
        {hasDiscount && (
          <span className="bg-miki-rose text-white text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-miki-sky text-white text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs">
            NEW
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-miki-yellow text-slate-900 text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs">
            ★ BESTSELLER
          </span>
        )}
      </div>

      {/* Image Container with Full Uncropped Image Display */}
      <Link
        href={`/shop/${product.slug}`}
        onClick={handleProductClick}
        className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-1 sm:p-2 block cursor-pointer"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-1.5 sm:p-2 group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-slate-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="bg-white/95 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 group-hover:scale-105 transition-transform">
            <Eye className="w-3.5 h-3.5 text-miki-pink" />
            <span>View Details</span>
          </span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3 bg-white">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 font-medium mb-1 gap-1">
            <span className="truncate">{product.dimensions}</span>
            {product.stockStatus === "in_stock" && (
              <span className="text-emerald-600 flex items-center gap-0.5 font-semibold shrink-0">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> In Stock
              </span>
            )}
            {product.stockStatus === "low_stock" && (
              <span className="text-amber-600 flex items-center gap-0.5 font-semibold shrink-0">
                <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Low
              </span>
            )}
            {product.stockStatus === "out_of_stock" && (
              <span className="text-rose-500 font-semibold shrink-0">Out of stock</span>
            )}
          </div>

          <Link href={`/shop/${product.slug}`} onClick={handleProductClick} className="block group/link">
            <h3 className="text-xs sm:text-base font-semibold text-slate-800 line-clamp-2 group-hover/link:text-miki-rose group-hover:text-miki-rose transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="min-w-0">
            <div className="text-xs sm:text-lg font-bold text-slate-900 truncate">
              {formatPrice(activePrice)}
            </div>
            {hasDiscount && (
              <div className="text-[10px] sm:text-xs text-slate-400 line-through truncate">
                {formatPrice(product.basePrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stockStatus === "out_of_stock"}
            className="bg-miki-pink hover:bg-miki-rose disabled:bg-slate-300 text-white p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer shrink-0 z-10"
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
