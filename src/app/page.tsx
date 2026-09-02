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
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 space-y-20 pb-16">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-miki-lightPink via-miki-cream to-white pt-12 pb-20 px-4 sm:px-8">
          <div className="absolute top-10 left-10 w-96 h-96 bg-miki-pink/20 rounded-full blur-3xl animate-float-slow pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-miki-yellow/20 rounded-full blur-3xl animate-float-delayed pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-miki-sky/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <ScrollReveal variant="fade-up" delay={0}>
                <div className="inline-flex items-center gap-2 bg-white/90 border border-miki-pink/30 px-4 py-2 rounded-full shadow-sm text-xs font-bold text-miki-rose transition-transform hover:scale-105">
                  <Sparkles className="w-4 h-4 text-miki-pink fill-miki-pink animate-pulse" />
                  <span>Sri Lanka's Favorite Nursery Decor & Gift Shop</span>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="slide-left" delay={150}>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
                  Transform Your Baby's Nursery with <span className="text-transparent bg-clip-text bg-gradient-to-r from-miki-pink via-miki-rose to-miki-lavender">Artful Treasures</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={250}>
                <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Charming safari animal prints, personalized newborn birth stats wall art, wooden growth charts, and luxury gifts. Handcrafted to inspire sweet dreams.
                </p>
              </ScrollReveal>

              {/* CTAs */}
              <ScrollReveal variant="scale-up" delay={350}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/categories/wall-art"
                    className="bg-miki-pink hover:bg-miki-rose text-white text-sm font-bold px-7 py-3.5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 pulse-glow"
                  >
                    <Frame className="w-5 h-5" />
                    <span>Shop Nursery Wall Art</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/categories/gifts"
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-sm font-bold px-6 py-3.5 rounded-2xl shadow-sm transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Gift className="w-5 h-5 text-miki-pink" />
                    <span>Explore Baby Gifts</span>
                  </Link>
                </div>
              </ScrollReveal>

              {/* Social Proof Trust Strip */}
              <ScrollReveal variant="fade-up" delay={450}>
                <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
                  <div className="hover:scale-105 transition-transform">
                    <div className="flex items-center gap-1 text-miki-yellow font-extrabold text-sm sm:text-base">
                      <Star className="w-4 h-4 fill-current" /> 100%
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">FB Recommendation Rate</p>
                  </div>
                  <div className="hover:scale-105 transition-transform">
                    <div className="text-slate-900 font-extrabold text-sm sm:text-base">10K+</div>
                    <p className="text-[11px] text-slate-500 font-medium">Facebook Fans</p>
                  </div>
                  <div className="hover:scale-105 transition-transform">
                    <div className="text-emerald-600 font-extrabold text-sm sm:text-base">COD</div>
                    <p className="text-[11px] text-slate-500 font-medium">Islandwide Delivery</p>
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
                    className="group block relative glass-card rounded-3xl p-4 shadow-2xl space-y-4 transform hover:rotate-1 hover:scale-105 transition-all duration-500 cursor-pointer border border-white/60 hover:border-miki-pink/40"
                    title="View Watercolor Woodland Safari Wall Art Set Details"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-inner">
                      <Image
                        src="/images/generated/safari_animals_wall_art.jpg"
                        alt="MIKI Baby Room Wall Art"
                        fill
                        priority
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md text-xs font-bold text-slate-800 flex items-center gap-1.5 group-hover:bg-miki-pink group-hover:text-white transition-colors">
                        <Sparkles className="w-3.5 h-3.5 text-miki-pink fill-miki-pink group-hover:text-white group-hover:fill-white" />
                        <span>Safari Animals Set of 3</span>
                      </div>
                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/95 text-slate-900 text-xs font-extrabold px-3.5 py-2 rounded-full shadow-xl flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                          <span>View Product Details</span>
                          <ArrowRight className="w-3.5 h-3.5 text-miki-pink" />
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Sri Lanka Best Seller</p>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-miki-rose transition-colors">
                          Watercolor Woodland Safari Set
                        </p>
                      </div>
                      <span className="bg-miki-pink text-white text-xs font-bold px-4 py-2 rounded-xl shadow group-hover:bg-miki-rose transition-colors flex items-center gap-1">
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
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <ScrollReveal variant="scale-up" delay={100}>
            <div className="glass-card rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border border-slate-100 shadow-xl bg-white/90">
              <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50/80 transition-all hover:scale-105">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-miki-pink flex items-center justify-center shrink-0 shadow-sm border border-rose-100">
                  <Truck className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">Fast & Reliable Delivery</h4>
                  <p className="text-xs text-slate-500 font-medium">Islandwide courier with order tracking</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50/80 transition-all hover:scale-105">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">Premium Quality Craft</h4>
                  <p className="text-xs text-slate-500 font-medium">300gsm linen cardstock & eco pine frames</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50/80 transition-all hover:scale-105">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">Easy Returns & Exchanges</h4>
                  <p className="text-xs text-slate-500 font-medium">Damage-free guarantee & hassle-free swaps</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50/80 transition-all hover:scale-105">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 shadow-sm border border-sky-100">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">24/7 Dedicated Support</h4>
                  <p className="text-xs text-slate-500 font-medium">Instant WhatsApp & phone help: 076 756 8100</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* CATEGORIES PILLS GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <ScrollReveal variant="fade-up" delay={0}>
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-miki-pink uppercase tracking-wider">Browse by Category</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Explore Collections</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                Find the perfect wall art pieces, gift sets, and room decor tailored for your baby.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {categories.map((cat, idx) => (
              <ScrollReveal key={cat.categoryId} variant="fade-up" delay={idx * 80} className="h-full">
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group glass-card p-2.5 sm:p-3.5 md:p-4 rounded-2xl text-center flex flex-col justify-between items-center h-full hover:-translate-y-1.5 transition-all duration-300 hover:shadow-card hover:border-miki-pink/40 border border-slate-100 bg-white active:scale-[0.98] cursor-pointer"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100/80 shadow-xs mb-2 sm:mb-2.5 shrink-0">
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
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-miki-rose transition-colors line-clamp-2 leading-tight text-center">
                        {cat.name}
                      </h3>
                    </div>
                    <span className="mt-1 text-[10px] sm:text-xs font-semibold text-miki-pink group-hover:text-miki-rose flex items-center gap-1 transition-transform group-hover:translate-x-0.5">
                      <span>Explore</span>
                      <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* FEATURED NURSERY WALL ART */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <ScrollReveal variant="fade-up" delay={0}>
            <div className="flex items-end justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-miki-pink uppercase tracking-wider">Top Recommended</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Wall Art & Decor</h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-miki-rose hover:text-miki-pink flex items-center gap-1 transition-transform hover:translate-x-1"
              >
                <span>View All</span>
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
        </section>

        {/* PROMO BANNER WITH SCROLL REVEAL */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <ScrollReveal variant="slide-left" delay={100}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-miki-pink via-miki-rose to-miki-lavender text-white p-8 sm:p-12 shadow-2xl">
              <div className="relative z-10 max-w-xl space-y-4">
                <span className="bg-white/20 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full inline-block animate-pulse">
                  🎉 Welcome Offer for Facebook Visitors
                </span>
                <h3 className="text-2xl sm:text-4xl font-black leading-tight">
                  Get 10% Off Your First Nursery Order!
                </h3>
                <p className="text-xs sm:text-sm text-white/90">
                  Use promo code <strong className="bg-white text-slate-900 px-2.5 py-0.5 rounded font-black tracking-wide shadow-sm">MIKIBABY10</strong> at checkout to claim your discount. Valid on all wall art sets and baby gifts.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="bg-white hover:bg-slate-100 text-miki-rose font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-lg inline-block transition-transform hover:scale-105 active:scale-95"
                  >
                    Shop Now with Discount
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* NEW ARRIVALS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <ScrollReveal variant="fade-up" delay={0}>
            <div className="flex items-end justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-miki-sky uppercase tracking-wider">Fresh Creations</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">New Arrivals</h2>
              </div>
              <Link
                href="/categories/new-arrivals"
                className="text-xs font-bold text-miki-sky hover:text-sky-600 flex items-center gap-1 transition-transform hover:translate-x-1"
              >
                <span>Explore New</span>
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
        </section>

        {/* REVIEWS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <ScrollReveal variant="fade-up" delay={0}>
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-current text-miki-yellow" /> 100% Facebook Recommendation Rating
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">What Parents Say About MIKI</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <ScrollReveal key={rev.id} variant="fade-up" delay={idx * 150}>
                <div className="glass-card rounded-3xl p-6 space-y-4 border border-slate-100 flex flex-col justify-between hover:shadow-card transition-all hover:-translate-y-1 h-full">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-miki-yellow">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{rev.author}</p>
                      <p className="text-[10px] text-slate-400">{rev.date}</p>
                    </div>
                    {rev.verified && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
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
