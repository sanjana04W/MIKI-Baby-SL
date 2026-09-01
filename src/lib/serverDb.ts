import fs from "fs";
import path from "path";
import { CustomerUser, Order } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Pre-seeded customer accounts available on all devices (empty by default)
const INITIAL_SERVER_USERS: CustomerUser[] = [];

// Ensure data directory and files exist
function ensureFilesExist() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), "utf8");
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf8");
    }
  } catch (err) {
    console.error("Error creating data storage files:", err);
  }
}

// In-memory fallback if file system is read-only (e.g. some serverless environments)
let inMemoryUsers: CustomerUser[] = [];
let inMemoryOrders: Order[] = [];

export function getServerUsers(): CustomerUser[] {
  try {
    ensureFilesExist();
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf8");
      const cleanData = data.replace(/^\uFEFF/, "").trim();
      const parsed = JSON.parse(cleanData || "[]");
      if (Array.isArray(parsed)) {
        inMemoryUsers = parsed;
        return inMemoryUsers;
      }
    }
  } catch (err) {
    console.error("Error reading users file, using memory fallback:", err);
  }
  return inMemoryUsers;
}

export function clearAllServerUsers(): void {
  inMemoryUsers = [];
  try {
    ensureFilesExist();
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), "utf8");
  } catch (err) {
    console.error("Error clearing users file:", err);
  }
}

export function saveServerUsers(users: CustomerUser[]): boolean {
  inMemoryUsers = users;
  try {
    ensureFilesExist();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing users file:", err);
    return false;
  }
}

export function findServerUserByEmail(email: string): CustomerUser | undefined {
  const users = getServerUsers();
  if (!email || !Array.isArray(users)) return undefined;
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u && typeof u.email === "string" && u.email.trim().toLowerCase() === normalized);
}

export function createServerUser(user: CustomerUser): CustomerUser {
  const users = getServerUsers();
  const normalizedEmail = (user.email || "").trim().toLowerCase();
  
  const cleanUser: CustomerUser = {
    id: user.id || `cust-${Date.now()}`,
    name: (user.name || "").trim(),
    email: normalizedEmail,
    phone: (user.phone || "").trim(),
    password: (user.password || "").trim(),
    address: (user.address || "").trim(),
    district: user.district || "Colombo",
    createdAt: user.createdAt || new Date().toISOString(),
  };

  // Filter out any existing matching email before inserting
  const filtered = users.filter((u) => u && typeof u.email === "string" && u.email.trim().toLowerCase() !== normalizedEmail);
  const updated = [...filtered, cleanUser];
  saveServerUsers(updated);
  return cleanUser;
}

export function updateServerUser(id: string, updates: Partial<CustomerUser>): CustomerUser | null {
  const users = getServerUsers();
  let updatedUser: CustomerUser | null = null;
  const updateEmail = updates.email ? updates.email.trim().toLowerCase() : undefined;

  const updatedUsers = users.map((u) => {
    if (!u) return u;
    const userEmail = typeof u.email === "string" ? u.email.trim().toLowerCase() : "";
    if (u.id === id || (updateEmail && userEmail === updateEmail)) {
      updatedUser = { ...u, ...updates };
      return updatedUser;
    }
    return u;
  });

  if (updatedUser) {
    saveServerUsers(updatedUsers);
  }
  return updatedUser;
}

export function resetServerUserPassword(email: string, newPassword: string): boolean {
  const users = getServerUsers();
  if (!email || !newPassword) return false;
  const normalized = email.trim().toLowerCase();
  let found = false;

  const updatedUsers = users.map((u) => {
    if (u && typeof u.email === "string" && u.email.trim().toLowerCase() === normalized) {
      found = true;
      return { ...u, password: newPassword.trim() };
    }
    return u;
  });

  if (found) {
    saveServerUsers(updatedUsers);
    return true;
  }
  return false;
}

export function getServerOrders(): Order[] {
  try {
    ensureFilesExist();
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf8");
      const cleanData = data.replace(/^\uFEFF/, "").trim();
      const parsed = JSON.parse(cleanData || "[]");
      if (Array.isArray(parsed)) {
        inMemoryOrders = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading orders file, using memory fallback:", err);
  }
  return inMemoryOrders;
}

export function saveServerOrders(orders: Order[]): boolean {
  inMemoryOrders = orders;
  try {
    ensureFilesExist();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing orders file:", err);
    return false;
  }
}

export function createServerOrder(order: Order): Order {
  const orders = getServerOrders();
  const updated = [order, ...orders.filter((o) => o.orderId !== order.orderId)];
  saveServerOrders(updated);
  return order;
}
