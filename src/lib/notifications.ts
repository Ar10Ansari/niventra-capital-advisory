import { randomBytes } from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { db } from "./db";

export interface SendNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: "ENQUIRY" | "GRIEVANCE" | "SECURITY" | "SYSTEM" | "DOCUMENT";
  link?: string;
  emailNotification?: {
    to: string;
    subject: string;
    htmlBody?: string;
  };
}

function getEmailSinkPath(): string | null {
  try {
    const localDir = path.join(process.cwd(), "data");
    if (fs.existsSync(localDir)) {
      return path.join(localDir, "email_sink.log");
    }
  } catch {
    // Read-only filesystem
  }
  return null;
}

/**
 * Sends an in-app notification and dispatches to local email sink
 */
export function sendNotification(params: SendNotificationParams): void {
  const id = `notif_${Date.now()}_${randomBytes(6).toString("hex")}`;

  // 1. Insert in-app notification
  const stmt = db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, link)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, params.userId, params.title, params.message, params.type, params.link || null);

  // 2. Dispatch to local email sink (non-invasive development recorder)
  if (params.emailNotification) {
    const emailEntry = {
      timestamp: new Date().toISOString(),
      to: params.emailNotification.to,
      subject: params.emailNotification.subject,
      title: params.title,
      message: params.message,
    };

    const sinkPath = getEmailSinkPath();
    if (sinkPath) {
      try {
        fs.appendFileSync(sinkPath, JSON.stringify(emailEntry) + "\n", "utf-8");
      } catch (err) {
        console.error("Failed to append to local email sink:", err);
      }
    } else {
      console.log(`[Dev Notification Recorded (No External Email Sent)] To: ${emailEntry.to} | Subject: ${emailEntry.subject}`);
    }
  }
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
