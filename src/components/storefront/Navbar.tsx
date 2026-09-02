"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  MessageCircle,
  Heart,
  Sparkles,
  User,
  Gift,
  Frame,
  Tag,
  Truck,
  Star,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { setIsCartOpen, totalItems, wishlist } = useCart();
  const { products } = useStore();
  const { customer } = useCustomerAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredSearch = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
    }
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Home", emoji: "🏠" },
    { href: "/shop", label: "Shop All", emoji: "🛍️" },
    { href: "/categories/wall-art", label: "Baby Wall Art", emoji: "🖼️" },
    { href: "/categories/gifts", label: "Baby Gifts", emoji: "🎁" },
    { href: "/track-order", label: "Track Order", emoji: "🚚", accent: "text-sky-600" },
    { href: "/wishlist", label: "Saved Wishlist", emoji: "❤️", accent: "text-miki-rose" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-secondary">
      {/* Top Announcement Ticker */}
      <div className="bg-gradient-to-r from-miki-pink via-miki-rose to-miki-lavender text-white text-xs font-semibold py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2">
            <span className="flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-[11px]">
              <Star className="w-3 h-3 fill-current text-miki-yellow" /> 100% FB Recommendation
            </span>
            <span>Islandwide Cash on Delivery (COD)</span>
          </div>

          <div className="w-full md:w-auto text-center font-bold flex items-center justify-center gap-4 text-[11px] sm:text-xs">
            <span>👶🏼 MIKI Baby Room Wall Art &amp; Gifts</span>
            <Link href="/track-order" className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1 transition-colors">
              <Truck className="w-3 h-3" /> Track Order
            </Link>
            <a
              href="https://wa.me/94767568100"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-miki-lightYellow flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" /> 076 756 8100
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav className="glass-navbar px-4 sm:px-8 py-3.5 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo.png"
                alt="MIKI Baby SL Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                MIKI <Sparkles className="w-4 h-4 text-miki-pink fill-miki-pink animate-pulse" />
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase -mt-1">
                Baby SL • Wall Art &amp; Gifts
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search baby room wall art, birth stats, gifts..."
                className="w-full bg-white/80 border border-slate-200 focus:border-miki-pink focus:ring-2 focus:ring-miki-pink/20 rounded-full py-2 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Live Autocomplete Dropdown */}
            {searchFocused && filteredSearch.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-2 space-y-1">
                {filteredSearch.map((item) => (
                  <Link
                    key={item.productId}
                    href={`/shop/${item.slug}`}
                    className="flex items-center gap-3 p-2 hover:bg-miki-lightPink rounded-xl transition-colors text-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 relative overflow-hidden shrink-0">
                      <img src={item.images[0]} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-miki-pink font-bold">{item.dimensions}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-700">
            <Link href="/" className="hover:text-miki-rose transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-miki-rose transition-colors">Shop All</Link>
            <Link href="/categories/wall-art" className="hover:text-miki-rose transition-colors flex items-center gap-1">
              <Frame className="w-3.5 h-3.5 text-miki-pink" /> Wall Art
            </Link>
            <Link href="/categories/gifts" className="hover:text-miki-rose transition-colors flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-miki-rose" /> Gifts
            </Link>
            <Link href="/track-order" className="hover:text-miki-rose transition-colors flex items-center gap-1 text-slate-600">
              <Truck className="w-3.5 h-3.5 text-miki-sky" /> Track Order
            </Link>
            <Link href="/categories/offers" className="hover:text-miki-rose transition-colors flex items-center gap-1 text-miki-rose font-bold">
              <Tag className="w-3.5 h-3.5" /> Offers
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href={customer ? "/account" : "/login"}
              className="relative transition-all flex items-center"
              title={customer ? `Profile: ${customer.name}` : "Sign In / Register"}
            >
              {customer ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-miki-pink text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-pink-100 border-2 border-white hover:scale-105 transition-all">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-miki-rose hover:border-miki-pink transition-all">
                  <User className="w-5 h-5" />
                </div>
              )}
            </Link>

            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-miki-rose hover:border-miki-pink transition-all"
              title="Saved Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? "text-miki-rose fill-miki-rose" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-miki-rose text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-miki-pink hover:bg-miki-rose text-white p-2.5 rounded-2xl shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-miki-yellow text-slate-900 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl bg-white border border-slate-200 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Side Drawer ── */}
      {/* Backdrop */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer Panel - slides from right */}
      <div
        className={`fixed top-0 right-0 z-[60] h-full w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-miki-lightPink to-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-slate-100 bg-white shrink-0">
              <Image src="/images/logo.png" alt="MIKI" width={32} height={32} className="object-contain p-0.5" />
            </div>
            <span className="font-heading font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1">
              MIKI <Sparkles className="w-3.5 h-3.5 text-miki-pink fill-miki-pink" />
            </span>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-4 pb-2 shrink-0">
          <form
            onSubmit={(e) => { handleSearchSubmit(e); closeMenu(); }}
            className="relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-miki-pink"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Account Banner */}
        <div className="px-4 py-2 shrink-0">
          <Link
            href={customer ? "/account" : "/login"}
            onClick={closeMenu}
            className="flex items-center gap-3 p-3 rounded-2xl bg-miki-lightPink border border-miki-pink/30 hover:bg-miki-pink/10 transition-colors"
          >
            {customer ? (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-miki-pink text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0">
                {customer.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-miki-pink/20 text-miki-pink flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-miki-rose truncate">
                {customer ? `My Account (${customer.name})` : "Sign In / Create Account"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {customer ? customer.email : "Track orders & manage profile"}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-miki-pink shrink-0" />
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Navigation</p>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold bg-white border border-slate-100 hover:border-miki-pink/30 hover:bg-miki-lightPink transition-all group ${link.accent || "text-slate-700"}`}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-base leading-none">{link.emoji}</span>
                {link.label}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-miki-pink transition-colors" />
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-6 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-3 shrink-0">
          <Link href="/about" onClick={closeMenu} className="text-xs font-semibold text-slate-500 hover:text-miki-pink transition-colors">About Us</Link>
          <Link href="/contact" onClick={closeMenu} className="text-xs font-semibold text-slate-500 hover:text-miki-pink transition-colors">Contact</Link>
          <Link href="/faq" onClick={closeMenu} className="text-xs font-semibold text-slate-500 hover:text-miki-pink transition-colors">FAQ</Link>
          <a
            href="https://wa.me/94767568100"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
};
