import { AuditLog, AuditAction, AdminRole } from "@/types";
import { INITIAL_AUDIT_LOGS } from "@/lib/initialData";

const AUDIT_KEY = "miki_audit_logs";

export function getAuditLogs(): AuditLog[] {
  try {
    const stored = localStorage.getItem(AUDIT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
    // Seed with initial data on first load
    localStorage.setItem(AUDIT_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function addAuditLog(entry: Omit<AuditLog, "id" | "timestamp">): AuditLog {
  const newEntry: AuditLog = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  try {
    const logs = getAuditLogs();
    const updated = [newEntry, ...logs];
    localStorage.setItem(AUDIT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to write audit log:", e);
  }
  return newEntry;
}

export function clearAuditLogs(): void {
  try {
    localStorage.setItem(AUDIT_KEY, JSON.stringify([]));
  } catch {}
}

export function logAdminAction(params: {
  action: AuditAction;
  adminName: string;
  adminEmail: string;
  adminRole: AdminRole;
  targetType: AuditLog["targetType"];
  targetId: string;
  targetName: string;
  details: string;
  metadata?: Record<string, any>;
}): AuditLog {
  return addAuditLog({
    action: params.action,
    performedBy: {
      name: params.adminName,
      email: params.adminEmail,
      role: params.adminRole,
    },
    targetType: params.targetType,
    targetId: params.targetId,
    targetName: params.targetName,
    details: params.details,
    metadata: params.metadata,
  });
}
