import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const { hash, salt } = hashPassword(password);
    const userId = `usr_${Date.now()}_${randomBytes(6).toString("hex")}`;

    // Public registration grants INVESTOR role; ADMIN/STAFF cannot be registered publicly
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, phone, status)
      VALUES (?, ?, ?, ?, ?, 'INVESTOR', ?, 'ACTIVE')
    `);
    stmt.run(userId, name.trim(), normalizedEmail, hash, salt, phone || null);

    // Create session
    const { token, expiresAt } = createSession(userId);

    // Audit log
    logAuditEvent({
      actorId: userId,
      actorEmail: normalizedEmail,
      actorRole: "INVESTOR",
      action: "AUTH_REGISTER",
      resourceType: "USER",
      resourceId: userId,
      details: { name: name.trim(), email: normalizedEmail },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        role: "INVESTOR",
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
