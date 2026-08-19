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
  login: (email: string, password: string) => { success: boolean; message: string; user?: CustomerUser };
  register: (data: { name: string; email: string; phone: string; password: string }) => { success: boolean; message: string; user?: CustomerUser };
  logout: () => void;
  updateProfile: (updated: Partial<CustomerUser>) => void;
  toast: CustomerToastState | null;
  hideToast: () => void;
  showToast: (type: "success" | "error", title: string, message: string) => void;
}

const USERS_STORAGE_KEY = "miki_customer_users";
const SESSION_STORAGE_KEY = "miki_customer_session";

// Pre-seeded demo customer accounts
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
    createdAt: new Date().toISOString(),
  },
];

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<CustomerToastState | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      // Ensure initial users list is seeded
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      }

      // Check for active customer session
      const activeSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (activeSession) {
        setCustomer(JSON.parse(activeSession));
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

  const getUsersList = (): CustomerUser[] => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_USERS;
  };

  const login = (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const users = getUsersList();
    const foundUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

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

    // Login successful
    const sessionUser = { ...foundUser };
    delete sessionUser.password;

    setCustomer(sessionUser);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    } catch {}

    const successMsg = `Welcome back, ${sessionUser.name}! Logged in successfully. 👏`;
    showToast("success", "LOGIN SUCCESSFUL", successMsg);

    return { success: true, message: successMsg, user: sessionUser };
  };

  const register = (data: { name: string; email: string; phone: string; password: string }) => {
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

    const users = getUsersList();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);

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
      address: "",
      district: "Colombo",
    };

    const updatedUsers = [...users, newUser];
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    } catch {}

    // Automatically log in after registration
    const sessionUser = { ...newUser };
    delete sessionUser.password;

    setCustomer(sessionUser);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    } catch {}

    const successMsg = `Welcome to MIKI Baby SL, ${sessionUser.name}! Your account has been created. 🎉`;
    showToast("success", "ACCOUNT CREATED", successMsg);

    return { success: true, message: successMsg, user: sessionUser };
  };

  const logout = () => {
    setCustomer(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {}
    showToast("success", "SIGNED OUT", "You have been signed out safely. See you soon!");
  };

  const updateProfile = (updated: Partial<CustomerUser>) => {
    if (!customer) return;
    const newCustomer = { ...customer, ...updated };
    setCustomer(newCustomer);

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newCustomer));
      const users = getUsersList().map((u) => (u.id === customer.id ? { ...u, ...updated } : u));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {}

    showToast("success", "PROFILE UPDATED", "Your profile details have been saved successfully.");
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
