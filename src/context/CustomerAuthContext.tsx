"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CustomerUser } from "@/types";

export interface CustomerToastState {
  visible: boolean;
  type: "success" | "error";
  title: string;
  message: string;
}

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: CustomerUser }>;
  register: (data: { name: string; email: string; phone: string; password: string; address?: string; district?: string }) => Promise<{ success: boolean; message: string; user?: CustomerUser }>;
  logout: () => void;
  updateProfile: (updated: Partial<CustomerUser>) => Promise<void>;
  toast: CustomerToastState | null;
  hideToast: () => void;
  showToast: (type: "success" | "error", title: string, message: string) => void;
}

// ── Storage keys ─────────────────────────────────────────────────────────────
const SESSION_LS_KEY  = "miki_customer_session"; // localStorage — same browser
const SESSION_COOKIE  = "miki_auth";             // cookie — survives restarts & cross-tab
const COOKIE_DAYS     = 30;

// ── Cookie helpers ────────────────────────────────────────────────────────────
function readCookie(): CustomerUser | null {
  try {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(?:^|;\\s*)" + SESSION_COOKIE + "=([^;]*)"));
    if (match && match[1]) {
      return JSON.parse(decodeURIComponent(match[1]));
    }
  } catch {}
  return null;
}

function writeCookie(user: CustomerUser) {
  try {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
    document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(JSON.stringify(user))}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {}
}

function eraseCookie() {
  try {
    if (typeof document === "undefined") return;
    document.cookie = `${SESSION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    document.cookie = `${SESSION_COOKIE}=; max-age=0; path=/; SameSite=Lax`;
    document.cookie = `${SESSION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${SESSION_COOKIE}=; max-age=0; path=/`;
  } catch {}
}

// ── Session persistence helpers ───────────────────────────────────────────────
function persistSession(user: CustomerUser) {
  try {
    localStorage.setItem(SESSION_LS_KEY, JSON.stringify(user));
  } catch {}
  writeCookie(user);
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_LS_KEY);
    sessionStorage.clear();
  } catch {}
  eraseCookie();
}

// ── Context ───────────────────────────────────────────────────────────────────
const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<CustomerToastState | null>(null);

  // ── Restore session on mount ───────────────────────────────────────────────
  // Priority: localStorage → cookie (covers: browser restart, fresh tab, private window)
  useEffect(() => {
    try {
      const lsRaw = localStorage.getItem(SESSION_LS_KEY);
      if (lsRaw) {
        const parsed: CustomerUser = JSON.parse(lsRaw);
        setCustomer(parsed);
        writeCookie(parsed); // keep cookie in sync
      } else {
        // localStorage empty — try cookie (e.g. after browser restart, new tab)
        const cookieUser = readCookie();
        if (cookieUser) {
          setCustomer(cookieUser);
          try { localStorage.setItem(SESSION_LS_KEY, JSON.stringify(cookieUser)); } catch {}
        }
      }
    } catch {
      // Ignore parse errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Toast helpers ─────────────────────────────────────────────────────────
  const showToast = (type: "success" | "error", title: string, message: string) =>
    setToast({ visible: true, type, title, message });

  const hideToast = () => setToast(null);

  // ── Login ──────────────────────────────────────────────────────────────────
  // ALWAYS authenticates via the server API so the same email+password works
  // from any device, any browser, at any time — even after sign-out.
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: CustomerUser }> => {
    const trimmedEmail    = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      const msg = "Please enter both email and password.";
      showToast("error", "LOGIN FAILED", msg);
      return { success: false, message: msg };
    }

    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
        cache:   "no-store", // always get a fresh response
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        const sessionUser: CustomerUser = data.user;
        setCustomer(sessionUser);
        // Store in localStorage + 30-day cookie so session survives:
        // browser restarts, different browser windows, and future visits
        persistSession(sessionUser);

        const msg = data.message || `Welcome back, ${sessionUser.name}! Logged in successfully. 👏`;
        showToast("success", "LOGIN SUCCESSFUL", msg);
        return { success: true, message: msg, user: sessionUser };
      }

      // Server responded but credentials were wrong
      const msg = data.message || "Invalid email or password. Please check and try again.";
      showToast("error", "LOGIN FAILED", msg);
      return { success: false, message: msg };

    } catch {
      // Network / server not running
      const msg =
        "Could not reach the server. Please ensure the server is running and your device is connected to the same network, then try again.";
      showToast("error", "CONNECTION ERROR", msg);
      return { success: false, message: msg };
    }
  };

  // ── Register ───────────────────────────────────────────────────────────────
  // Saves the account in the server database so it can be accessed from any
  // device or browser immediately after registration.
  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    district?: string;
  }): Promise<{ success: boolean; message: string; user?: CustomerUser }> => {
    const trimmedEmail    = data.email.trim().toLowerCase();
    const trimmedName     = data.name.trim();
    const trimmedPhone    = data.phone.trim();
    const trimmedPassword = data.password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      const msg = "Please fill in all required fields.";
      showToast("error", "REGISTRATION FAILED", msg);
      return { success: false, message: msg };
    }

    if (trimmedPassword.length < 6) {
      const msg = "Password must be at least 6 characters long.";
      showToast("error", "REGISTRATION FAILED", msg);
      return { success: false, message: msg };
    }

    try {
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:     trimmedName,
          email:    trimmedEmail,
          phone:    trimmedPhone,
          password: trimmedPassword,
          address:  data.address  || "",
          district: data.district || "Colombo",
        }),
        cache: "no-store",
      });

      const resData = await res.json();

      if (res.ok && resData.success && resData.user) {
        const sessionUser: CustomerUser = resData.user;
        setCustomer(sessionUser);
        persistSession(sessionUser);

        const msg = resData.message || `Welcome to MIKI Baby SL, ${sessionUser.name}! Your account has been created. 🎉`;
        showToast("success", "ACCOUNT CREATED", msg);
        return { success: true, message: msg, user: sessionUser };
      }

      const msg = resData.message || "Could not complete registration. Please try again.";
      showToast("error", "REGISTRATION FAILED", msg);
      return { success: false, message: msg };

    } catch {
      const msg =
        "Could not reach the server. Please ensure the server is running and your device is connected to the same network, then try again.";
      showToast("error", "CONNECTION ERROR", msg);
      return { success: false, message: msg };
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  // Clears session from localStorage AND the cookie so this device is fully
  // signed out. The account remains on the server — user can sign back in
  // at any time with the same email and password.
  const logout = () => {
    setCustomer(null);
    clearSession(); // removes from localStorage + cookie
    showToast("success", "SIGNED OUT", "You have been signed out safely. See you soon!");
  };

  // ── Update Profile ─────────────────────────────────────────────────────────
  const updateProfile = async (updated: Partial<CustomerUser>) => {
    if (!customer) return;
    const newCustomer = { ...customer, ...updated };
    setCustomer(newCustomer);
    persistSession(newCustomer); // refresh localStorage + cookie

    try {
      await fetch("/api/auth/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id: customer.id, email: customer.email, updates: updated }),
      });
    } catch (err) {
      console.warn("Profile update sync warning:", err);
    }

    showToast("success", "PROFILE UPDATED", "Your profile details have been saved successfully.");
  };

  return (
    <CustomerAuthContext.Provider
      value={{ customer, isLoading, login, register, logout, updateProfile, toast, hideToast, showToast }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  return ctx;
};
