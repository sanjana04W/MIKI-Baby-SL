"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState("owner@mikibaby.lk");
  const [password, setPassword] = useState("admin123");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const success = login(email);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setErrorMsg("Invalid email or password. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 sm:p-8">
      {/* Main Login Card */}
      <div className="max-w-md w-full my-auto">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
          {/* Circular Lock Icon Badge */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 text-miki-pink flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">
                ADMIN PORTAL
              </h1>
              <p className="text-xs text-slate-500 mt-1">Sign in to manage your store</p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mikibaby.lk"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 placeholder-slate-400 text-xs outline-none focus:ring-2 focus:ring-miki-pink transition-all"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 placeholder-slate-400 text-xs outline-none focus:ring-2 focus:ring-miki-pink transition-all tracking-widest"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-miki-pink hover:bg-miki-rose text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-xs uppercase tracking-widest cursor-pointer mt-2"
            >
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
