"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  MessageCircle,
  Star,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Frame,
  Box,
  Gift,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, generateWhatsAppDirectInquiry } from "@/lib/utils";
import { trackAddToCart } from "@/lib/metaPixel";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { products, getProductBySlug, reviews } = useStore();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const product = getProductBySlug(slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product?.variants?.[0]?.name
  );
  const [quantity, setQuantity] = useState(1);

  // Personalization fields state
  const [personName, setPersonName] = useState("");
  const [personDate, setPersonDate] = useState("");
  const [personStats, setPersonStats] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);

  // Review submission state
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [productReviews, setProductReviews] = useState(reviews);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            The wall art or gift product you are looking for does not exist or has been archived.
          </p>
          <Link
            href="/shop"
            className="bg-miki-pink text-white text-xs font-bold px-6 py-3 rounded-full shadow"
          >
            Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  let activePrice = product.salePrice || product.basePrice;
  if (selectedVariant && product.variants) {
    const v = product.variants.find((varItem) => varItem.name === selectedVariant);
    if (v) activePrice = v.price;
  }
  if (giftWrap) activePrice += 250;

  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const isSaved = isInWishlist(product.productId);

  const buildPersonalizationString = () => {
    if (!product.isPersonalizable) return undefined;
    const parts = [];
    if (personName.trim()) parts.push(`Baby Name: ${personName.trim()}`);
    if (personDate.trim()) parts.push(`Birth Date: ${personDate.trim()}`);
    if (personStats.trim()) parts.push(`Stats: ${personStats.trim()}`);
    return parts.length > 0 ? parts.join(" | ") : undefined;
  };

  const handleAddToCart = () => {
    const details = buildPersonalizationString();

    addToCart({
      productId: product.productId,
      name: product.name,
      price: activePrice,
      quantity,
      variant: selectedVariant,
      image: product.images[selectedImageIndex] || product.images[0],
      dimensions: product.dimensions,
      personalizationDetails: details,
    });

    trackAddToCart({
      id: product.productId,
      name: product.name,
      price: activePrice,
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: reviewerName.trim(),
      rating: reviewerRating,
      comment: reviewerComment.trim(),
      date: "Just now",
      verified: true,
      productName: product.name,
    };

    setProductReviews([newRev, ...productReviews]);
    setReviewSubmitted(true);
    setReviewerName("");
    setReviewerComment("");
  };

  const whatsappInquiryUrl = generateWhatsAppDirectInquiry(product.name);
  const relatedProducts = products
    .filter((p) => p.productId !== product.productId && p.categoryId === product.categoryId)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-12 pb-24 sm:pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-slate-800">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-slate-800">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 truncate max-w-xs font-bold">{product.name}</span>
        </div>

        {/* Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Multi-Image Gallery with Object-Contain Full View */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-50 shadow-lg border border-slate-100 group flex items-center justify-center p-4">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-contain p-3"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {hasDiscount && (
                  <span className="bg-miki-rose text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                    SALE DISCOUNT
                  </span>
                )}
                {product.isPersonalizable && (
                  <span className="bg-miki-lavender text-white text-xs font-extrabold px-3 py-1 rounded-full shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Customizable
                  </span>
                )}
              </div>

              {/* Wishlist Heart Button */}
              <button
                onClick={() => toggleWishlist(product.productId)}
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-md text-slate-700 hover:text-miki-rose transition-transform active:scale-95"
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? "text-miki-rose fill-miki-rose" : ""}`} />
              </button>
            </div>

            {/* Thumbnails Full Image Display */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 bg-slate-50 transition-all shrink-0 p-1 flex items-center justify-center ${
                      selectedImageIndex === idx
                        ? "border-miki-pink scale-105 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Options */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-miki-pink/10 text-miki-pink text-xs font-bold px-3 py-1 rounded-full">
                  MIKI Signature Collection
                </span>
                <span className="text-xs text-slate-500 font-medium">SKU: {product.productId}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-miki-yellow">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">5.0 (15 Verified FB Ratings)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-miki-lightPink/50 border border-miki-pink/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase block">Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    {formatPrice(activePrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(product.basePrice)}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {product.stockStatus === "in_stock" && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> In Stock ({product.stockLevel})
                  </span>
                )}
                {product.stockStatus === "low_stock" && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Low Stock ({product.stockLevel} left)
                  </span>
                )}
                {product.stockStatus === "out_of_stock" && (
                  <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Product Specifications */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Frame className="w-3.5 h-3.5 text-miki-pink" /> Dimensions / Size
                </span>
                <p className="font-bold text-slate-800">{product.dimensions}</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Box className="w-3.5 h-3.5 text-miki-rose" /> Material Quality
                </span>
                <p className="font-bold text-slate-800 line-clamp-1">{product.material}</p>
              </div>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Select Framing Option:</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.name)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedVariant === v.name
                          ? "bg-miki-pink text-white border-miki-pink shadow"
                          : "bg-white text-slate-700 border-slate-200 hover:border-miki-pink"
                      }`}
                    >
                      {v.name} ({formatPrice(v.price)})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Personalization Inputs */}
            {product.isPersonalizable && (
              <div className="p-4 rounded-2xl bg-miki-cream border border-miki-pink/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-miki-pink/20 pb-2">
                  <Sparkles className="w-4 h-4 text-miki-pink fill-miki-pink" />
                  <span>Personalize This Wall Art Piece</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Child / Baby's Name *</label>
                    <input
                      type="text"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      placeholder="e.g. Liam Perera"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-miki-pink"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
                      <input
                        type="text"
                        value={personDate}
                        onChange={(e) => setPersonDate(e.target.value)}
                        placeholder="e.g. 15 August 2026"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Birth Stats (Weight/Time)</label>
                      <input
                        type="text"
                        value={personStats}
                        onChange={(e) => setPersonStats(e.target.value)}
                        placeholder="e.g. 3.2 kg / 08:45 AM"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gift Wrap Toggle */}
            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:border-miki-pink transition-colors">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="rounded text-miki-pink focus:ring-miki-pink w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-miki-rose" /> Add Luxury Gift Packaging & Satin Ribbon (+ Rs. 250)
                </span>
                <p className="text-[11px] text-slate-500">Perfect for baby shower gifts and newborn visits</p>
              </div>
            </label>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Description & Craftsmanship
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Desktop Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-300 rounded-2xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-3 text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stockStatus === "out_of_stock"}
                  className="flex-1 bg-miki-pink hover:bg-miki-rose disabled:bg-slate-300 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.stockStatus === "out_of_stock"}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
              >
                <span>Buy Now with Cash on Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Ask Question about this Product on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="space-y-6 pt-10 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Verified Parent Reviews</h2>
              <p className="text-xs text-slate-500">Based on customer feedback from Sri Lankan parents</p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productReviews.map((rev) => (
              <div key={rev.id} className="glass-card rounded-2xl p-5 space-y-2 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{rev.author}</span>
                  <div className="flex text-miki-yellow">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                <span className="text-[10px] text-slate-400 block pt-1">{rev.date}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
