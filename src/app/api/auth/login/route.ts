import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  salt: string;
  role: "PUBLIC" | "INVESTOR" | "STAFF" | "ADMIN";
  status: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query user by email
    const stmt = db.prepare(`
      SELECT id, name, email, password_hash, salt, role, status
      FROM users
      WHERE email = ?
    `);
    const user = stmt.get(normalizedEmail) as UserRow | undefined;

    // Generic error to prevent account enumeration
    if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
      logAuditEvent({
        actorEmail: normalizedEmail,
        action: "AUTH_LOGIN_FAILED",
        resourceType: "SESSION",
        status: "FAILED",
        details: { reason: "Invalid credentials" },
      });
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      logAuditEvent({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: "AUTH_LOGIN_BLOCKED",
        resourceType: "SESSION",
        status: "BLOCKED",
        details: { accountStatus: user.status },
      });
      return NextResponse.json(
        { error: "Your account is not active. Please contact support." },
        { status: 403 }
      );
    }

    // Create session
    const { token, expiresAt } = createSession(user.id);

    // Audit log
    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "AUTH_LOGIN_SUCCESS",
      resourceType: "SESSION",
      status: "SUCCESS",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
