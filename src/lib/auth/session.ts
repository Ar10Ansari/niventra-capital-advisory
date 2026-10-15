import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "../db";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: "PUBLIC" | "INVESTOR" | "STAFF" | "ADMIN";
  phone: string | null;
  status: string;
  created_at: string;
}

export const SESSION_COOKIE_NAME = "niventra_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Creates a persistent session in SQLite
 */
export function createSession(userId: string): { token: string; expiresAt: Date } {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const id = `sess_${Date.now()}_${randomBytes(6).toString("hex")}`;

  const stmt = db.prepare(`
    INSERT INTO sessions (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(id, userId, token, expiresAt.toISOString());

  return { token, expiresAt };
}

/**
 * Validates a session token and returns the authenticated user
 */
export function getUserBySessionToken(token: string): SafeUser | null {
  if (!token) return null;

  const now = new Date().toISOString();
  const stmt = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.phone, u.status, u.created_at
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > ? AND u.status = 'ACTIVE'
  `);

  const row = stmt.get(token, now) as SafeUser | undefined;
  return row || null;
}

/**
 * Deletes a session on sign out
 */
export function invalidateSession(token: string): void {
  const stmt = db.prepare("DELETE FROM sessions WHERE token = ?");
  stmt.run(token);
}

/**
 * Helper to get currently logged-in user in Server Components and Route Handlers
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return getUserBySessionToken(token);
  } catch {
    return null;
  }
}
