import { randomBytes } from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { db } from "@/lib/db";

export interface SendNotificationParams {
  userId?: string | null;
  title: string;
  message: string;
  type: "ENQUIRY" | "GRIEVANCE" | "SECURITY" | "SYSTEM" | "DOCUMENT";
  link?: string;
  emailNotification?: {
    to: string | string[];
    subject: string;
    htmlBody?: string;
  };
}

export interface LeadNotificationPayload {
  referenceId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  category: string;
  capitalRange: string;
  message?: string | null;
}

export interface NotificationResult {
  success: boolean;
  mode: "MOCK_SINK" | "REST_API" | "DISABLED";
  recipientCount: number;
  error?: string;
}

/**
 * Masks personal email addresses to ensure logs never expose sensitive PII.
 * Example: 'alexander@example.com' -> 'a***r@example.com'
 */
function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return "***@***";
  const [local, domain] = parts;
  if (local.length <= 2) return `${local[0] || "*"}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

function getEmailSinkPath(): string | null {
  try {
    const localDir = path.join(process.cwd(), "data");
    if (fs.existsSync(localDir)) {
      return path.join(localDir, "email_sink.log");
    }
  } catch {
    // Read-only filesystem in serverless runtime
  }
  return null;
}

/**
 * Sends an in-app notification (if userId provided) and dispatches via notification transport.
 */
export function sendNotification(params: SendNotificationParams): void {
  const id = `notif_${Date.now()}_${randomBytes(6).toString("hex")}`;

  // 1. Insert in-app notification if a registered user ID exists
  if (params.userId) {
    try {
      const stmt = db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type, link)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, params.userId, params.title, params.message, params.type, params.link || null);
    } catch (err) {
      console.warn("Could not insert in-app notification:", err);
    }
  }

  // 2. Dispatch to local email sink (non-invasive development recorder)
  if (params.emailNotification) {
    const toRecipients = Array.isArray(params.emailNotification.to)
      ? params.emailNotification.to
      : [params.emailNotification.to];

    const emailEntry = {
      timestamp: new Date().toISOString(),
      to: toRecipients.map(maskEmail),
      subject: params.emailNotification.subject,
      title: params.title,
      message: params.message,
    };

    const sinkPath = getEmailSinkPath();
    if (sinkPath) {
      try {
        fs.appendFileSync(sinkPath, JSON.stringify(emailEntry) + "\n", "utf-8");
      } catch {
        // Fallback gracefully
      }
    } else {
      console.log(`[Dev Notification Recorded] Recipients: ${emailEntry.to.join(", ")} | Subject: ${emailEntry.subject}`);
    }
  }
}

/**
 * Neutral lead notification dispatcher for both public and authenticated submissions.
 * In development or unconfigured staging, it logs to local email sink.
 * In production with configured environment variables, it relays to approved outbound endpoint.
 */
export async function dispatchLeadNotification(
  payload: LeadNotificationPayload
): Promise<NotificationResult> {
  const staffRecipientsEnv = process.env.LEAD_NOTIFICATION_EMAILS;
  const staffRecipients = staffRecipientsEnv
    ? staffRecipientsEnv.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const maskedUserEmail = maskEmail(payload.email);

  // 1. Check if external email provider credentials exist
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "Niventra Advisory <notifications@niventracapitaladvisory.com>";

  if (resendApiKey && staffRecipients.length > 0) {
    try {
      // Dispatches via provider-neutral REST API using global fetch
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: staffRecipients,
          subject: `New Advisory Consultation Request — ${payload.referenceId} (${payload.category})`,
          text: `A new consultation enquiry has been recorded.\n\nReference ID: ${payload.referenceId}\nCategory: ${payload.category}\nCapital Range: ${payload.capitalRange}\nProspect Name: ${payload.fullName}\nEmail: ${payload.email}\nPhone: ${payload.phoneNumber}\nNotes: ${payload.message || "None provided"}\n\nReview record in admin portal.`,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("External email dispatch failed:", errText);
        return { success: false, mode: "REST_API", recipientCount: staffRecipients.length, error: "External gateway error" };
      }

      return { success: true, mode: "REST_API", recipientCount: staffRecipients.length };
    } catch (err) {
      console.error("Failed to connect to email gateway:", err);
      return { success: false, mode: "REST_API", recipientCount: staffRecipients.length, error: "Network error" };
    }
  }

  // 2. Default Local Mock Mode (Safe, Offline, No Secrets)
  const sinkPath = getEmailSinkPath();
  const mockRecord = {
    timestamp: new Date().toISOString(),
    event: "PUBLIC_LEAD_RECORDED",
    referenceId: payload.referenceId,
    category: payload.category,
    capitalRange: payload.capitalRange,
    maskedUserEmail,
    staffNotificationStatus: staffRecipients.length > 0 ? "CONFIGURED_STAFF_PENDING" : "NO_STAFF_RECIPIENT_CONFIGURED",
  };

  if (sinkPath) {
    try {
      fs.appendFileSync(sinkPath, JSON.stringify(mockRecord) + "\n", "utf-8");
    } catch {
      // Graceful fallback
    }
  } else {
    console.log(`[Dev Lead Recorded] Ref: ${payload.referenceId} | Category: ${payload.category} | Prospect: ${maskedUserEmail}`);
  }

  return {
    success: true,
    mode: "MOCK_SINK",
    recipientCount: staffRecipients.length,
  };
}

/**
 * Returns notifications for a specific user
 */
export function getUserNotifications(userId: string, limit = 20) {
  const stmt = db.prepare(`
    SELECT id, title, message, type, link, is_read, created_at
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);
  return stmt.all(userId, limit);
}

/**
 * Marks a notification as read
 */
export function markNotificationAsRead(notificationId: string, userId: string): void {
  const stmt = db.prepare(`
    UPDATE notifications
    SET is_read = 1
    WHERE id = ? AND user_id = ?
  `);
  stmt.run(notificationId, userId);
}
