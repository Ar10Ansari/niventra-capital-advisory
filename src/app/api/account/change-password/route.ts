import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { logAuditEvent } from "@/lib/audit";

interface UserCredentialRow {
  id: string;
  email: string;
  password_hash: string;
  salt: string;
  role: string;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Retrieve user credentials
    const row = db.prepare(`
      SELECT id, email, password_hash, salt, role
      FROM users
      WHERE id = ?
    `).get(user.id) as UserCredentialRow | undefined;

    if (!row || !verifyPassword(currentPassword, row.password_hash, row.salt)) {
      logAuditEvent({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: "PASSWORD_CHANGE_FAILED",
        resourceType: "CREDENTIALS",
        status: "FAILED",
        details: { reason: "Incorrect current password" },
      });
      return NextResponse.json({ error: "Current password verification failed." }, { status: 403 });
    }

    // Hash new password
    const { hash, salt } = hashPassword(newPassword);

    db.prepare(`
      UPDATE users
      SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(hash, salt, user.id);

    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "PASSWORD_CHANGED_SUCCESS",
      resourceType: "CREDENTIALS",
      status: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}
