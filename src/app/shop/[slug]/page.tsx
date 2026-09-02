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
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { formatPrice, generateWhatsAppDirectInquiry } from "@/lib/utils";
import { trackAddToCart } from "@/lib/metaPixel";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { products, getProductBySlug, reviews, orders, addReview } = useStore();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { customer } = useCustomerAuth();

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
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

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

  // Filter approved reviews for this product
  const approvedReviews = reviews.filter(
    (r) => r.productId === product.productId && r.status === "approved"
  );
  const reviewCount = approvedReviews.length;
  const averageRating =
    reviewCount > 0
      ? Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
      : 5.0;

  // Check verified purchase eligibility
  const hasPurchased = Boolean(
    customer &&
    orders.some((ord) => {
      const emailMatch =
        ord.customerInfo.email.trim().toLowerCase() === customer.email.trim().toLowerCase();
      const idMatch = ord.customerId && ord.customerId === customer.id;
      const containsProd = ord.items.some(
        (item) => item.productId === product.productId || item.name.toLowerCase() === product.name.toLowerCase()
      );
      return (emailMatch || idMatch) && containsProd && ord.orderStatus !== "Cancelled";
    })
  );

  const hasAlreadyReviewed = Boolean(
    customer &&
    reviews.some(
      (r) =>
        r.productId === product.productId &&
        (r.customerId === customer.id || r.customerId === customer.email.toLowerCase())
    )
  );

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!customer) {
      setReviewError("Please sign in to submit a review.");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Please provide your review feedback.");
      return;
    }

    setIsSubmittingReview(true);
    const res = await addReview({
      productId: product.productId,
      productSlug: product.slug,
      productName: product.name,
      author: customer.name,
      customerId: customer.id,
      customerEmail: customer.email,
      rating: reviewRating,
      title: reviewTitle.trim() || undefined,
      comment: reviewComment.trim(),
    });
    setIsSubmittingReview(false);

    if (res.success) {
      setReviewSuccess("Thank you! Your verified parent review has been published. 🎉");
      setReviewTitle("");
      setReviewComment("");
      setShowReviewForm(false);
    } else {
      setReviewError(res.message);
    }
  };

  const whatsappInquiryUrl = generateWhatsAppDirectInquiry(product.name);
  const relatedProducts = products
    .filter((p) => p.productId !== product.productId && p.categoryId === product.categoryId)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FFFBF7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-12 pb-24 sm:pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/80 border border-pink-100/80 px-4 py-2 rounded-2xl shadow-2xs w-fit">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-pink-300" />
          <Link href="/shop" className="hover:text-rose-600 transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-pink-300" />
          <span className="text-slate-900 truncate max-w-xs font-black">{product.name}</span>
        </div>

        {/* Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Multi-Image Gallery with Object-Contain Full View */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50/60 via-white to-amber-50/40 shadow-md border-2 border-pink-100/90 group flex items-center justify-center p-5">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-contain p-4 drop-shadow-sm"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {hasDiscount && (
                  <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-sm tracking-wide">
                    {discountPercent}% OFF SALE
                  </span>
                )}
                {product.isPersonalizable && (
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1 tracking-wide">
                    <Sparkles className="w-3 h-3" /> Custom Name
                  </span>
                )}
              </div>

              {/* Wishlist Heart Button */}
              <button
                onClick={() => toggleWishlist(product.productId)}
                className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-full shadow-md text-slate-700 hover:text-rose-600 transition-transform active:scale-95 border border-pink-100"
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? "text-rose-500 fill-rose-500" : ""}`} />
              </button>
            </div>

            {/* Thumbnails Full Image Display */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 bg-gradient-to-br from-rose-50 to-white transition-all shrink-0 p-1 flex items-center justify-center ${
                      selectedImageIndex === idx
                        ? "border-rose-500 scale-105 shadow-md shadow-pink-200"
                        : "border-pink-100/80 opacity-70 hover:opacity-100"
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
                <span className="bg-pink-100 text-rose-700 text-xs font-black px-3 py-1 rounded-full border border-pink-200">
                  MIKI Signature Collection
                </span>
                <span className="text-xs text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  SKU: {product.productId}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-snug font-heading">
                {product.name}
              </h1>

              {/* Rating */}
              <a
                href="#customer-reviews"
                className="inline-flex items-center gap-2.5 mt-3 group cursor-pointer bg-amber-50/80 px-3 py-1 rounded-full border border-amber-200/80"
              >
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-slate-800 group-hover:text-rose-600 transition-colors">
                  {averageRating.toFixed(1)} ({reviewCount}{" "}
                  {reviewCount === 1 ? "Verified Review" : "Verified Reviews"})
                </span>
              </a>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-50 via-[#FFF5F8] to-amber-50/50 border-2 border-pink-200/90 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-extrabold text-slate-500 uppercase block tracking-wider">Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                    {formatPrice(activePrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-rose-400 font-bold line-through">
                      {formatPrice(product.basePrice)}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {product.stockStatus === "in_stock" && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> In Stock ({product.stockLevel})
                  </span>
                )}
                {product.stockStatus === "low_stock" && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-black px-3.5 py-1.5 rounded-full border border-amber-200 shadow-2xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Low Stock ({product.stockLevel} left)
                  </span>
                )}
                {product.stockStatus === "out_of_stock" && (
                  <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-xs font-black px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Product Specifications */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl border-2 border-pink-100 bg-white space-y-1 shadow-2xs">
                <span className="text-rose-500 font-black flex items-center gap-1">
                  <Frame className="w-4 h-4" /> Dimensions / Size
                </span>
                <p className="font-extrabold text-slate-800">{product.dimensions}</p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-pink-100 bg-white space-y-1 shadow-2xs">
                <span className="text-rose-500 font-black flex items-center gap-1">
                  <Box className="w-4 h-4" /> Material Quality
                </span>
                <p className="font-extrabold text-slate-800 line-clamp-1">{product.material}</p>
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
        <section id="customer-reviews" className="space-y-8 pt-10 border-t border-slate-200 scroll-mt-24">
          {/* Header & Write Review Action */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                  Verified Customer Reviews
                </h2>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Verified Purchases
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Authentic ratings & experiences shared by Sri Lankan parents who purchased this product.
              </p>
            </div>

            {/* Write Review Action Area */}
            <div>
              {!customer ? (
                <Link
                  href={`/login?redirect=${encodeURIComponent(`/shop/${slug}#customer-reviews`)}`}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-md transition-all active:scale-95"
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Sign In to Write a Review</span>
                </Link>
              ) : hasAlreadyReviewed ? (
                <div className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>You have reviewed this product</span>
                </div>
              ) : hasPurchased ? (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="inline-flex items-center gap-2 bg-miki-pink hover:bg-miki-rose text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>{showReviewForm ? "Cancel Review" : "Write a Verified Review"}</span>
                </button>
              ) : (
                <div className="bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold px-4 py-2.5 rounded-2xl flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Purchase this item to leave a verified review</span>
                </div>
              )}
            </div>
          </div>

          {/* Review Success / Error Alerts */}
          {reviewSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{reviewSuccess}</span>
            </div>
          )}
          {reviewError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{reviewError}</span>
            </div>
          )}

          {/* Interactive Review Form (when toggled by verified buyer) */}
          {showReviewForm && customer && hasPurchased && !hasAlreadyReviewed && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-100 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Write Your Verified Review</h3>
                  <p className="text-xs text-slate-500">
                    Reviewing as <strong className="text-slate-800">{customer.name}</strong> ({customer.email})
                  </p>
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  Verified Purchaser
                </span>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-5">
                {/* Interactive Star Rating */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                    YOUR RATING <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating || reviewRating) >= star;
                        return (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 transition-colors ${
                                isFilled ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-300"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {reviewRating === 5 && "⭐⭐⭐⭐⭐ Excellent (5/5)"}
                      {reviewRating === 4 && "⭐⭐⭐⭐ Very Good (4/5)"}
                      {reviewRating === 3 && "⭐⭐⭐ Good (3/5)"}
                      {reviewRating === 2 && "⭐⭐ Fair (2/5)"}
                      {reviewRating === 1 && "⭐ Needs Improvement (1/5)"}
                    </span>
                  </div>
                </div>

                {/* Review Title (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                    REVIEW HEADLINE / TITLE <span className="text-slate-400 font-normal">(OPTIONAL)</span>
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Stunning quality frame and vibrant colors!"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 rounded-2xl py-3 px-4 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                </div>

                {/* Review Comment (Required) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                    DETAILED REVIEW & EXPERIENCE <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share what you loved about the product, quality of print/frame, packaging, and delivery speed..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 rounded-2xl p-4 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="bg-slate-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <span>{isSubmittingReview ? "SUBMITTING..." : "SUBMIT VERIFIED REVIEW"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3.5 rounded-2xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Rating Breakdown & Overview Card */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Average Score Box */}
            <div className="md:col-span-4 text-center md:text-left md:border-r md:border-slate-200 md:pr-8 space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center md:justify-start text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-600">
                Based on {reviewCount} {reviewCount === 1 ? "verified parent rating" : "verified parent ratings"}
              </p>
              <p className="text-[11px] text-slate-400">
                100% genuine customer reviews from verified orders
              </p>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="md:col-span-8 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = approvedReviews.filter((r) => r.rating === star).length;
                const percentage =
                  reviewCount > 0
                    ? Math.round((count / reviewCount) * 100)
                    : star === 5
                    ? 100
                    : 0;

                return (
                  <div key={star} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <span className="w-12 text-slate-700 shrink-0">{star} Stars</span>
                    <div className="flex-1 h-3 rounded-full bg-slate-200/80 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-slate-400 text-[11px] shrink-0 font-medium">
                      {percentage}% ({count})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          {approvedReviews.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-miki-pink flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 fill-miki-pink" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Customer Reviews Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Be the first parent to share your feedback once your order arrives! We take immense pride in our craftsmanship and nursery art quality.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {approvedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-6 space-y-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Review Top Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-miki-pink text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                        {rev.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                            {rev.author}
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-emerald-200/60 flex items-center gap-0.5">
                            <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                            Verified
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title if present */}
                  {rev.title && (
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      "{rev.title}"
                    </h4>
                  )}

                  {/* Comment */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
