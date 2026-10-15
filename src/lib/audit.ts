import { randomBytes } from "node:crypto";
import { db } from "./db";

export interface CreateAuditLogParams {
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  details?: Record<string, unknown> | string | null;
  ipAddress?: string | null;
  status?: "SUCCESS" | "FAILED" | "BLOCKED";
}

/**
 * Appends an immutable audit event to the audit_logs table
 */
export function logAuditEvent(params: CreateAuditLogParams): void {
  try {
    const id = `aud_${Date.now()}_${randomBytes(6).toString("hex")}`;
    const detailsStr =
      typeof params.details === "object" && params.details !== null
        ? JSON.stringify(params.details)
        : params.details || null;

    const stmt = db.prepare(`
      INSERT INTO audit_logs (
        id, actor_id, actor_email, actor_role, action,
        resource_type, resource_id, details, ip_address, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      params.actorId || null,
      params.actorEmail || null,
      params.actorRole || null,
      params.action,
      params.resourceType,
      params.resourceId || null,
      detailsStr,
      params.ipAddress || null,
      params.status || "SUCCESS"
    );
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
