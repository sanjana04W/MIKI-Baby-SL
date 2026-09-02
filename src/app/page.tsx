"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  MessageCircle,
  Heart,
  CheckCircle,
  Gift,
  Frame,
  Tag,
  ThumbsUp,
  Award,
  Zap,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";
import { useStore } from "@/context/StoreContext";

export default function HomePage() {
  const { products, categories, reviews } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured && p.status === "active");
  const newArrivals = products.filter((p) => p.isNewArrival && p.status === "active");

  const [showSocialPopup, setShowSocialPopup] = useState(false);
  const [popupText, setPopupText] = useState("");

  useEffect(() => {
    const locations = ["Colombo", "Kandy", "Galle", "Gampaha", "Kurunegala", "Negombo"];
    const items = [
      "Safari Jungle Wall Art (Set of 3)",
      "Personalized Birth Stats Cloud Art",
      "Teddy Bear Sleeping Moon Canvas",
      "Wooden Bunny Growth Height Ruler",
    ];

    const timer = setTimeout(() => {
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      setPopupText(`A parent in ${loc} just ordered ${item}! 👶🏼`);
      setShowSocialPopup(true);

      setTimeout(() => setShowSocialPopup(false), 5000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden bg-[#FFFBF7]">
      <Navbar />

      <main className="flex-1 space-y-16 sm:space-y-24 pb-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFE8F0] via-[#FFF5EC] to-[#FFFBF7] pt-12 pb-20 px-4 sm:px-8 border-b border-pink-100/60">
          <div className="absolute top-10 left-10 w-96 h-96 bg-miki-pink/25 rounded-full blur-3xl animate-float-slow pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-miki-yellow/25 rounded-full blur-3xl animate-float-delayed pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <ScrollReveal variant="fade-up" delay={0}>
                <div className="inline-flex items-center gap-2 bg-white/95 border-2 border-pink-200 px-4 py-2 rounded-full shadow-sm text-xs font-black text-rose-600 transition-transform hover:scale-105">
                  <Sparkles className="w-4 h-4 text-miki-pink fill-miki-pink animate-pulse" />
                  <span>Sri Lanka's Favorite Nursery Decor & Gift Shop</span>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="slide-left" delay={150}>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight font-heading">
                  Transform Your Baby's Nursery with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-miki-pink to-purple-500">
                    Artful Treasures
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={250}>
                <p className="text-slate-700 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Charming safari animal prints, personalized newborn birth stats wall art, wooden growth charts, and luxury keepsake gifts. Handcrafted to inspire sweet dreams.
                </p>
              </ScrollReveal>

              {/* CTAs */}
              <ScrollReveal variant="scale-up" delay={350}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/categories/wall-art"
                    className="bg-gradient-to-r from-miki-pink via-rose-500 to-miki-rose hover:from-rose-600 hover:to-pink-600 text-white text-sm font-black px-7 py-4 rounded-2xl shadow-lg shadow-pink-300/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <Frame className="w-5 h-5" />
                    <span>Shop Nursery Wall Art</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/categories/gifts"
                    className="bg-white hover:bg-rose-50/80 text-slate-900 border-2 border-pink-200/90 text-sm font-black px-6 py-4 rounded-2xl shadow-sm transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Gift className="w-5 h-5 text-miki-pink" />
                    <span>Explore Baby Gifts</span>
                  </Link>
                </div>
              </ScrollReveal>

              {/* Social Proof Trust Strip */}
              <ScrollReveal variant="fade-up" delay={450}>
                <div className="pt-6 border-t border-pink-200/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
                  <div className="bg-white/80 p-3 rounded-2xl border border-pink-100/80 shadow-2xs hover:scale-105 transition-transform">
                    <div className="flex items-center gap-1 text-amber-500 font-black text-sm sm:text-base">
                      <Star className="w-4 h-4 fill-current" /> 100%
                    </div>
                    <p className="text-[11px] text-slate-600 font-semibold">FB Recommended</p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-pink-100/80 shadow-2xs hover:scale-105 transition-transform">
                    <div className="text-slate-900 font-black text-sm sm:text-base font-heading">10K+</div>
                    <p className="text-[11px] text-slate-600 font-semibold">Facebook Fans</p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-pink-100/80 shadow-2xs hover:scale-105 transition-transform">
                    <div className="text-emerald-700 font-black text-sm sm:text-base font-heading">COD</div>
                    <p className="text-[11px] text-slate-600 font-semibold">Islandwide Delivery</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Hero Card with Real Local Image */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal variant="slide-right" delay={300}>
                <div className="relative mx-auto max-w-md animate-float-slow">
                  <Link
                    href="/shop/watercolor-woodland-safari-wall-art-set-001"
                    className="group block relative rounded-3xl p-4 shadow-2xl bg-gradient-to-b from-white via-[#FFF8F9] to-[#FFF0F4] border-2 border-pink-200/90 space-y-4 transform hover:rotate-1 hover:scale-105 transition-all duration-500 cursor-pointer"
                    title="View Watercolor Woodland Safari Wall Art Set Details"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-gradient-to-br from-rose-50 to-amber-50 p-2">
                      <Image
                        src="/images/generated/safari_animals_wall_art.jpg"
                        alt="MIKI Baby Room Wall Art"
                        fill
                        priority
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out rounded-xl"
                      />
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-xs font-black text-slate-800 flex items-center gap-1.5 group-hover:bg-miki-pink group-hover:text-white transition-colors border border-pink-100">
                        <Sparkles className="w-3.5 h-3.5 text-miki-pink fill-miki-pink group-hover:text-white group-hover:fill-white" />
                        <span>Safari Animals Set of 3</span>
                      </div>
                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-slate-900 text-xs font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform border border-pink-200">
                          <span>View Product Details</span>
                          <ArrowRight className="w-3.5 h-3.5 text-miki-pink" />
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2 pt-1">
                      <div>
                        <p className="text-[11px] text-rose-500 font-extrabold uppercase tracking-wider">
                          Sri Lanka Best Seller
                        </p>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-miki-rose transition-colors">
                          Watercolor Woodland Safari Set
                        </p>
                      </div>
                      <span className="bg-gradient-to-r from-miki-pink to-rose-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-sm group-hover:from-rose-600 group-hover:to-pink-600 transition-colors flex items-center gap-1">
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ANIMATED TRUST BADGES STRIP */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 sm:-mt-10 relative z-20">
          <ScrollReveal variant="scale-up" delay={100}>
            <div className="rounded-3xl p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-2 border-pink-100 shadow-xl bg-gradient-to-r from-white via-[#FFF9FA] to-[#FDF4F7]">
              <div className="flex items-center gap-4 p-2.5 rounded-2xl bg-white/70 border border-pink-100/60 hover:bg-white transition-all hover:scale-105 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs border border-rose-200">
                  <Truck className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Fast & Reliable Delivery</h4>
                  <p className="text-xs text-slate-500 font-medium">Islandwide courier with tracking</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-2.5 rounded-2xl bg-white/70 border border-amber-100/60 hover:bg-white transition-all hover:scale-105 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs border border-amber-200">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Premium Quality Craft</h4>
                  <p className="text-xs text-slate-500 font-medium">300gsm linen & eco pine frames</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-2.5 rounded-2xl bg-white/70 border border-emerald-100/60 hover:bg-white transition-all hover:scale-105 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Easy Returns & Exchanges</h4>
                  <p className="text-xs text-slate-500 font-medium">Damage-free transit guarantee</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-2.5 rounded-2xl bg-white/70 border border-sky-100/60 hover:bg-white transition-all hover:scale-105 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 shadow-xs border border-sky-200">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">24/7 Dedicated Support</h4>
                  <p className="text-xs text-slate-500 font-medium">WhatsApp help: 076 756 8100</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* CATEGORIES PILLS GRID - Warm Rose Background Container */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-gradient-to-b from-[#FFF2F5] via-[#FFF8FA] to-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-xs space-y-8">
            <ScrollReveal variant="fade-up" delay={0}>
              <div className="text-center space-y-2">
                <span className="inline-block bg-pink-100 text-rose-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-pink-200">
                  Browse by Category
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  Explore Nursery Collections
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
                  Find the perfect wall art pieces, milestone plaques, and room decor crafted for your little one.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {categories.map((cat, idx) => (
                <ScrollReveal key={cat.categoryId} variant="fade-up" delay={idx * 80} className="h-full">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group rounded-2xl p-3 sm:p-3.5 text-center flex flex-col justify-between items-center h-full hover:-translate-y-1.5 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 hover:border-pink-300 border-2 border-pink-100/80 bg-white active:scale-[0.98] cursor-pointer"
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50 border border-pink-100 shadow-2xs mb-2.5 shrink-0">
                      <Image
                        src={cat.image || "/images/661247360_122186257130624717_6303554255591935628_n.jpg"}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>

                    <div className="w-full flex-1 flex flex-col justify-between items-center">
                      <div className="min-h-[2.25rem] sm:min-h-[2.5rem] flex items-center justify-center w-full px-0.5">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-miki-rose transition-colors line-clamp-2 leading-tight text-center">
                          {cat.name}
                        </h3>
                      </div>
                      <span className="mt-1.5 text-[10px] sm:text-xs font-black text-miki-pink group-hover:text-rose-600 flex items-center gap-1 transition-transform group-hover:translate-x-0.5 bg-rose-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                        <span>Explore</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED NURSERY WALL ART - Soft Lavender/Blush Container */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-gradient-to-b from-[#FAF5FF] via-[#FFF5F8] to-white p-6 sm:p-10 rounded-3xl border border-purple-100/80 shadow-xs space-y-8">
            <ScrollReveal variant="fade-up" delay={0}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-pink-100 pb-5 gap-3">
                <div>
                  <span className="inline-block bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-purple-200">
                    Top Recommended
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
                    Featured Wall Art & Decor
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="text-xs font-black text-rose-600 hover:text-pink-600 flex items-center gap-1 transition-transform hover:translate-x-1 bg-white px-4 py-2 rounded-xl border border-pink-200 shadow-2xs self-start sm:self-auto"
                >
                  <span>View Full Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {featuredProducts.slice(0, 8).map((product, idx) => (
                <ScrollReveal key={product.productId} variant="scale-up" delay={idx * 100} className="h-full">
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* PROMO BANNER WITH RICH VIBRANT GRADIENT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <ScrollReveal variant="slide-left" delay={100}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-miki-pink to-purple-600 text-white p-8 sm:p-12 shadow-2xl border-2 border-pink-300/40">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 max-w-xl space-y-4">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-4 py-1.5 rounded-full inline-block border border-white/30 shadow-xs">
                  🎉 Welcome Offer for Facebook Visitors
                </span>
                <h3 className="text-2xl sm:text-4xl font-black leading-tight font-heading">
                  Get 10% Off Your First Nursery Order!
                </h3>
                <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed">
                  Use promo code{" "}
                  <strong className="bg-white text-slate-900 px-3 py-1 rounded-lg font-black tracking-wider shadow-sm text-sm inline-block mx-1">
                    MIKIBABY10
                  </strong>{" "}
                  at checkout to claim your discount. Valid on all wall art sets and baby gifts.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="bg-white hover:bg-slate-50 text-rose-600 font-black text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl inline-block transition-transform hover:scale-105 active:scale-95 border-2 border-pink-100"
                  >
                    Shop Now with Discount
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* NEW ARRIVALS - Soft Sky/Blue Tinted Container */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-gradient-to-b from-[#F0F9FF] via-[#F6F8FF] to-white p-6 sm:p-10 rounded-3xl border border-sky-100 shadow-xs space-y-8">
            <ScrollReveal variant="fade-up" delay={0}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-sky-100 pb-5 gap-3">
                <div>
                  <span className="inline-block bg-sky-100 text-sky-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-sky-200">
                    Fresh Creations
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
                    New Arrivals
                  </h2>
                </div>
                <Link
                  href="/categories/new-arrivals"
                  className="text-xs font-black text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-transform hover:translate-x-1 bg-white px-4 py-2 rounded-xl border border-sky-200 shadow-2xs self-start sm:self-auto"
                >
                  <span>Explore All New</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {newArrivals.slice(0, 8).map((product, idx) => (
                <ScrollReveal key={product.productId} variant="scale-up" delay={idx * 100} className="h-full">
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS SECTION - Warm Champagne/Gold Container */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-gradient-to-b from-[#FEFCE8]/80 via-[#FFF9F0] to-white p-6 sm:p-10 rounded-3xl border border-amber-100 shadow-xs space-y-8">
            <ScrollReveal variant="fade-up" delay={0}>
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border border-amber-200 shadow-2xs">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  100% Facebook Recommendation Rating
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  What Parents Say About MIKI
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
                  Read genuine feedback and reviews from Sri Lankan parents who transformed their baby nurseries.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev, idx) => (
                <ScrollReveal key={rev.id} variant="fade-up" delay={idx * 150}>
                  <div className="rounded-3xl p-6 space-y-4 border-2 border-amber-100/80 bg-gradient-to-b from-white to-[#FFFDF9] flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300 transition-all hover:-translate-y-1 h-full shadow-xs">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      {rev.title && (
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          "{rev.title}"
                        </h4>
                      )}
                      <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-amber-100 text-xs">
                      <div>
                        <p className="font-extrabold text-slate-900">{rev.author}</p>
                        <p className="text-[10px] text-slate-400">{rev.date}</p>
                      </div>
                      {rev.verified && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Social Proof Popup */}
      {showSocialPopup && (
        <div className="fixed bottom-6 left-6 z-50 animate-bounce">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-miki-pink/40 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{popupText}</span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
