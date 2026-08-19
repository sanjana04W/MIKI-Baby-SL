"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminUser, AdminPermissions } from "@/types";
import { INITIAL_ADMIN_USERS } from "@/lib/initialData";

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  login: (email: string) => boolean;
  logout: () => void;
  switchRole: (role: "owner" | "staff") => void;
  hasPermission: (permission: keyof AdminPermissions) => boolean;
  adminUsers: AdminUser[];
  updateStaffPermissions: (uid: string, permissions: AdminPermissions) => void;
  toggleUserStatus: (uid: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(INITIAL_ADMIN_USERS[0]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("miki_admin_user");
      if (savedUser) {
        setAdminUser(JSON.parse(savedUser));
      } else {
        setAdminUser(INITIAL_ADMIN_USERS[0]);
        localStorage.setItem("miki_admin_user", JSON.stringify(INITIAL_ADMIN_USERS[0]));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const login = (email: string): boolean => {
    const found = adminUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() ||
        (email.toLowerCase().includes("owner") && u.role === "owner") ||
        (email.toLowerCase().includes("staff") && u.role === "staff") ||
        email.toLowerCase().includes("admin")
    );

    const targetUser = found || adminUsers[0];
    if (targetUser && targetUser.isActive) {
      setAdminUser(targetUser);
      localStorage.setItem("miki_admin_user", JSON.stringify(targetUser));
      return true;
    }
    return false;
  };

  const switchRole = (role: "owner" | "staff") => {
    const target = adminUsers.find((u) => u.role === role) || adminUsers[0];
    setAdminUser(target);
    localStorage.setItem("miki_admin_user", JSON.stringify(target));
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem("miki_admin_user");
  };

  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (!adminUser) return false;
    if (adminUser.role === "owner") return true;
    return !!adminUser.assignedPermissions[permission];
  };

  const updateStaffPermissions = (uid: string, permissions: AdminPermissions) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, assignedPermissions: permissions } : u))
    );
  };

  const toggleUserStatus = (uid: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, isActive: !u.isActive } : u))
    );
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        login,
        logout,
        switchRole,
        hasPermission,
        adminUsers,
        updateStaffPermissions,
        toggleUserStatus,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return context;
};
