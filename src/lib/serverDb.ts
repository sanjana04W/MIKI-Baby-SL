import fs from "fs";
import path from "path";
import { CustomerUser, Order } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Pre-seeded customer accounts available on all devices
const INITIAL_SERVER_USERS: CustomerUser[] = [
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

// Ensure data directory and files exist
function ensureFilesExist() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(INITIAL_SERVER_USERS, null, 2), "utf8");
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf8");
    }
  } catch (err) {
    console.error("Error creating data storage files:", err);
  }
}

// In-memory fallback if file system is read-only (e.g. some serverless environments)
let inMemoryUsers: CustomerUser[] = [...INITIAL_SERVER_USERS];
let inMemoryOrders: Order[] = [];

export function getServerUsers(): CustomerUser[] {
  try {
    ensureFilesExist();
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Always trust the file contents — it is the source of truth
        inMemoryUsers = parsed.length > 0 ? parsed : INITIAL_SERVER_USERS;
        return inMemoryUsers;
      }
    }
  } catch (err) {
    console.error("Error reading users file, using memory fallback:", err);
  }
  return inMemoryUsers;
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
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.trim().toLowerCase() === normalized);
}

export function createServerUser(user: CustomerUser): CustomerUser {
  const users = getServerUsers();
  const normalizedEmail = user.email.trim().toLowerCase();
  
  // Filter out any existing matching email before inserting
  const filtered = users.filter((u) => u.email.trim().toLowerCase() !== normalizedEmail);
  const updated = [...filtered, user];
  saveServerUsers(updated);
  return user;
}

export function updateServerUser(id: string, updates: Partial<CustomerUser>): CustomerUser | null {
  const users = getServerUsers();
  let updatedUser: CustomerUser | null = null;

  const updatedUsers = users.map((u) => {
    if (u.id === id || (updates.email && u.email.trim().toLowerCase() === updates.email.trim().toLowerCase())) {
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
  const normalized = email.trim().toLowerCase();
  let found = false;

  const updatedUsers = users.map((u) => {
    if (u.email.trim().toLowerCase() === normalized) {
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
      const parsed = JSON.parse(data);
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
