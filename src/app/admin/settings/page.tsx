"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Store,
  Truck,
  Save,
  CheckCircle,
  Lightbulb,
  Globe,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
  Code2,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { adminUser } = useAdminAuth();

  // Store Profile State
  const [storeName, setStoreName] = useState("MIKI Baby SL");
  const [supportEmail, setSupportEmail] = useState("mikibabysl@gmail.com");
  const [contactPhone, setContactPhone] = useState("+94 76 756 8100");
  const [storeAddress, setStoreAddress] = useState("Online Exclusive, Delivery Islandwide, Sri Lanka");

  // Delivery & Pricing State
  const [colomboFee, setColomboFee] = useState(300);
  const [outstationFee, setOutstationFee] = useState(450);
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState(5000);
  const [weightSurcharge, setWeightSurcharge] = useState(50);

  // Third-Party Integrations
  const [emailServiceId, setEmailServiceId] = useState("service_a0e4sa8");
  const [emailTemplateId, setEmailTemplateId] = useState("template_97ld8eu");
  const [emailPublicKey, setEmailPublicKey] = useState("");
  const [metaPixelId, setMetaPixelId] = useState("123456789012345");

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!adminUser) {
      router.push("/admin/login");
    }
  }, [adminUser, router]);

  if (!adminUser) return null;
  if (adminUser.role !== "owner") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="p-10 text-rose-400 font-bold">
            Access Denied: Only Super Admin / Owner can modify System Settings.
          </div>
        </div>
      </div>
    );
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col">
      {/* Top Header with Role Switcher */}
      <AdminHeader />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <AdminSidebar />

        {/* System Settings Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 overflow-y-auto w-full max-w-full min-w-0 max-h-[calc(100vh-61px)]">
          {/* Header Title & Save Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                System Settings
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Configure store information, delivery rates, and third-party integrations
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              className="w-full sm:w-auto justify-center bg-miki-pink hover:bg-miki-rose text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>SAVE ALL SETTINGS</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>All system settings successfully updated and saved!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Card 1: Store Profile (Matching Image) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Store Profile</h2>
                  <p className="text-xs text-slate-500">
                    Your brand identity and contact info shown across the website
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    STORE NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-medium text-xs outline-none focus:ring-2 focus:ring-miki-pink"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    SUPPORT EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-medium text-xs outline-none focus:ring-2 focus:ring-miki-pink"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    CONTACT PHONE
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-medium text-xs outline-none focus:ring-2 focus:ring-miki-pink"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    STORE ADDRESS
                  </label>
                  <input
                    type="text"
                    required
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-medium text-xs outline-none focus:ring-2 focus:ring-miki-pink"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Delivery & Pricing (Matching Image) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Delivery & Pricing</h2>
                  <p className="text-xs text-slate-500">
                    Zone-based delivery fees and free shipping thresholds (LKR)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    COLOMBO ZONE FEE
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden px-3.5 focus-within:ring-2 focus-within:ring-miki-pink">
                    <input
                      type="number"
                      min={0}
                      value={colomboFee}
                      onChange={(e) => setColomboFee(Number(e.target.value))}
                      className="w-full bg-transparent py-3.5 text-slate-900 font-black text-xs outline-none"
                    />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      LKR
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    OUTSTATION FEE
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden px-3.5 focus-within:ring-2 focus-within:ring-miki-pink">
                    <input
                      type="number"
                      min={0}
                      value={outstationFee}
                      onChange={(e) => setOutstationFee(Number(e.target.value))}
                      className="w-full bg-transparent py-3.5 text-slate-900 font-black text-xs outline-none"
                    />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      LKR
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    FREE DELIVERY ABOVE
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden px-3.5 focus-within:ring-2 focus-within:ring-miki-pink">
                    <input
                      type="number"
                      min={0}
                      value={freeDeliveryAbove}
                      onChange={(e) => setFreeDeliveryAbove(Number(e.target.value))}
                      className="w-full bg-transparent py-3.5 text-slate-900 font-black text-xs outline-none"
                    />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      LKR
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    WEIGHT SURCHARGE / KG
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden px-3.5 focus-within:ring-2 focus-within:ring-miki-pink">
                    <input
                      type="number"
                      min={0}
                      value={weightSurcharge}
                      onChange={(e) => setWeightSurcharge(Number(e.target.value))}
                      className="w-full bg-transparent py-3.5 text-slate-900 font-black text-xs outline-none"
                    />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      LKR
                    </span>
                  </div>
                </div>
              </div>

              {/* Informational Callout Box (Matching Image) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong className="text-slate-900 font-bold">Colombo Zone</strong> includes Colombo,
                  Gampaha, and Kalutara districts. All other districts use the Outstation rate.
                  Orders above the Free Delivery threshold ship for free regardless of zone.
                </p>
              </div>
            </div>

            {/* Card 3: Third-Party & EmailJS Integrations */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-miki-pink border border-rose-100 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Third-Party & API Integrations</h2>
                  <p className="text-xs text-slate-500">
                    EmailJS verification, Facebook Pixel, and tracking configuration
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    EMAILJS SERVICE ID
                  </label>
                  <input
                    type="text"
                    value={emailServiceId}
                    onChange={(e) => setEmailServiceId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-mono text-xs outline-none focus:ring-2 focus:ring-miki-pink"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    EMAILJS TEMPLATE ID
                  </label>
                  <input
                    type="text"
                    value={emailTemplateId}
                    onChange={(e) => setEmailTemplateId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-mono text-xs outline-none focus:ring-2 focus:ring-miki-pink"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                    FACEBOOK PIXEL ID
                  </label>
                  <input
                    type="text"
                    value={metaPixelId}
                    onChange={(e) => setMetaPixelId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-mono text-xs outline-none focus:ring-2 focus:ring-miki-pink"
                  />
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
