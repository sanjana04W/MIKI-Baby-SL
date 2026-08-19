import { INITIAL_MESSAGES } from "@/lib/initialData";
import { CustomerMessage } from "@/types";

const MESSAGES_KEY = "miki_admin_messages";

/** Load messages from localStorage, falling back to INITIAL_MESSAGES */
export function getMessages(): CustomerMessage[] {
  if (typeof window === "undefined") return INITIAL_MESSAGES as CustomerMessage[];
  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (stored) return JSON.parse(stored) as CustomerMessage[];
  } catch {}
  // First load: seed localStorage with initial data
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
  return INITIAL_MESSAGES as CustomerMessage[];
}

/** Persist the full messages array to localStorage */
export function saveMessages(messages: CustomerMessage[]): void {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch {}
}

/** Mark a single message as read and persist */
export function markMessageRead(id: string): CustomerMessage[] {
  const msgs = getMessages().map((m) =>
    m.id === id && m.status === "unread" ? { ...m, status: "read" as const } : m
  );
  saveMessages(msgs);
  return msgs;
}

/** Mark all messages as read and persist */
export function markAllMessagesRead(): CustomerMessage[] {
  const msgs = getMessages().map((m) =>
    m.status === "unread" ? { ...m, status: "read" as const } : m
  );
  saveMessages(msgs);
  return msgs;
}

/** Count currently unread messages */
export function getUnreadCount(): number {
  return getMessages().filter((m) => m.status === "unread").length;
}

/** Prepend a new message and persist */
export function addMessage(msg: CustomerMessage): CustomerMessage[] {
  const existing = getMessages();
  const updated = [msg, ...existing];
  saveMessages(updated);
  return updated;
}
