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
  refreshCustomer: () => Promise<CustomerUser | null>;
  toast: CustomerToastState | null;
  hideToast: () => void;
  showToast: (type: "success" | "error", title: string, message: string) => void;
}

const USERS_STORAGE_KEY = "miki_customer_users";
const SESSION_STORAGE_KEY = "miki_customer_session";

// Pre-seeded demo customer accounts for fallback
const INITIAL_USERS: CustomerUser[] = [
  {
    id: "cust-wenuri-001",
    name: "Wenuris2004",
    email: "wenuris2004@gmail.com",
    phone: "+94 77 123 4567",
    password: "password123",
    address: "No 123, Main Street, Colombo 05",
    district: "Colombo",
    createdAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "cust-demo-002",
    name: "H.M. Wenuri Sanjana Herath",
    email: "test@example.com",
    phone: "076 756 8100",
    password: "password123",
    address: "No. 12, Kandy Road, Kiribathgoda",
    district: "Gampaha",
    createdAt: "2026-08-01T00:00:00.000Z",
  },
];

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<CustomerToastState | null>(null);

  // Initialize from localStorage and fetch server users
  useEffect(() => {
    try {
      // Check for active customer session on this device
      const activeSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        setCustomer(parsed);

        // Fetch fresh server profile to ensure cross-device updates sync automatically
        if (parsed.email) {
          fetch(`/api/auth/profile?email=${encodeURIComponent(parsed.email)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.user) {
                setCustomer(data.user);
                try {
                  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
                } catch {}
              }
            })
            .catch(() => {});
        }
      }

      // Seed local storage with default users if not set
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showToast = (type: "success" | "error", title: string, message: string) => {
    setToast({ visible: true, type, title, message });
  };

  const hideToast = () => {
    setToast(null);
  };

  const getLocalUsersList = (): CustomerUser[] => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_USERS;
  };

  const saveLocalUsersList = (users: CustomerUser[]) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {}
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: CustomerUser }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      const errorMsg = "Please enter both email and password.";
      showToast("error", "LOGIN FAILED", errorMsg);
      return { success: false, message: errorMsg };
    }

    try {
      // Authenticate against centralized server API (cross-device)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        const sessionUser: CustomerUser = data.user;
        setCustomer(sessionUser);

        try {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
        } catch {}

        const successMsg = data.message || `Welcome back, ${sessionUser.name}! Logged in successfully. 👏`;
        showToast("success", "LOGIN SUCCESSFUL", successMsg);
        return { success: true, message: successMsg, user: sessionUser };
      } else {
        const errorMsg = data.message || "Invalid email or password. Please check and try again.";
        showToast("error", "LOGIN FAILED", errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (networkError) {
      console.warn("Server auth unreachable, attempting local fallback:", networkError);

      // Offline / network fallback
      const localUsers = getLocalUsersList();
      const foundUser = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (!foundUser) {
        const errorMsg = "Account not found with this email. If you do not have an account, you must create an account first.";
        showToast("error", "ACCOUNT NOT FOUND", errorMsg);
        return { success: false, message: errorMsg };
      }

      if (foundUser.password && foundUser.password !== trimmedPassword) {
        const errorMsg = "Incorrect password. Please check your password and try again.";
        showToast("error", "LOGIN FAILED", errorMsg);
        return { success: false, message: errorMsg };
      }

      const sessionUser = { ...foundUser };
      delete sessionUser.password;

      setCustomer(sessionUser);
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
      } catch {}

      const successMsg = `Welcome back, ${sessionUser.name}! Logged in successfully. 👏`;
      showToast("success", "LOGIN SUCCESSFUL", successMsg);
      return { success: true, message: successMsg, user: sessionUser };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    district?: string;
  }): Promise<{ success: boolean; message: string; user?: CustomerUser }> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedName = data.name.trim();
    const trimmedPhone = data.phone.trim();
    const trimmedPassword = data.password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      const errorMsg = "Please fill in all required fields.";
      showToast("error", "REGISTRATION FAILED", errorMsg);
      return { success: false, message: errorMsg };
    }

    if (trimmedPassword.length < 6) {
      const errorMsg = "Password must be at least 6 characters long.";
      showToast("error", "REGISTRATION FAILED", errorMsg);
      return { success: false, message: errorMsg };
    }

    try {
      // Register with centralized server database (cross-device)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          password: trimmedPassword,
          address: data.address || "",
          district: data.district || "Colombo",
        }),
      });

      const resData = await res.json();

      if (res.ok && resData.success && resData.user) {
        const sessionUser: CustomerUser = resData.user;
        setCustomer(sessionUser);

        try {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
          const localUsers = getLocalUsersList();
          saveLocalUsersList([...localUsers.filter((u) => u.email.toLowerCase() !== trimmedEmail), sessionUser]);
        } catch {}

        const successMsg = resData.message || `Welcome to MIKI Baby SL, ${sessionUser.name}! Your account has been created. 🎉`;
        showToast("success", "ACCOUNT CREATED", successMsg);
        return { success: true, message: successMsg, user: sessionUser };
      } else {
        const errorMsg = resData.message || "Could not complete registration. Please try again.";
        showToast("error", "REGISTRATION FAILED", errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (networkError) {
      console.warn("Server registration unreachable, using local fallback:", networkError);

      const localUsers = getLocalUsersList();
      const existing = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (existing) {
        const errorMsg = "An account with this email already exists. Please sign in.";
        showToast("error", "ACCOUNT EXISTS", errorMsg);
        return { success: false, message: errorMsg };
      }

      const newUser: CustomerUser = {
        id: `cust-${Date.now()}`,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        password: trimmedPassword,
        createdAt: new Date().toISOString(),
        address: data.address || "",
        district: data.district || "Colombo",
      };

      saveLocalUsersList([...localUsers, newUser]);

      const sessionUser = { ...newUser };
      delete sessionUser.password;

      setCustomer(sessionUser);
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
      } catch {}

      const successMsg = `Welcome to MIKI Baby SL, ${sessionUser.name}! Your account has been created. 🎉`;
      showToast("success", "ACCOUNT CREATED", successMsg);
      return { success: true, message: successMsg, user: sessionUser };
    }
  };

  const logout = () => {
    setCustomer(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {}
    showToast("success", "SIGNED OUT", "You have been signed out safely. See you soon!");
  };

  const refreshCustomer = async (): Promise<CustomerUser | null> => {
    if (!customer?.email) return null;
    try {
      const res = await fetch(`/api/auth/profile?email=${encodeURIComponent(customer.email)}`);
      const data = await res.json();
      if (data.success && data.user) {
        setCustomer(data.user);
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
        } catch {}
        return data.user;
      }
    } catch {}
    return customer;
  };

  const updateProfile = async (updated: Partial<CustomerUser>) => {
    if (!customer) return;

    try {
      // Sync with centralized server first
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: customer.id,
          email: customer.email,
          updates: updated,
        }),
      });
      const data = await res.json();
      const finalUser = data.success && data.user ? data.user : { ...customer, ...updated };
      
      setCustomer(finalUser);
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(finalUser));
        const localUsers = getLocalUsersList().map((u) =>
          u.id === customer.id || u.email.toLowerCase() === customer.email.toLowerCase()
            ? { ...u, ...updated }
            : u
        );
        saveLocalUsersList(localUsers);
      } catch {}

      showToast("success", "PROFILE UPDATED", "Your profile details have been saved successfully.");
    } catch (err) {
      console.warn("Profile update sync warning:", err);
      const fallbackUser = { ...customer, ...updated };
      setCustomer(fallbackUser);
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(fallbackUser));
      } catch {}
      showToast("success", "PROFILE UPDATED", "Your profile details have been saved.");
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshCustomer,
        toast,
        hideToast,
        showToast,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
};
