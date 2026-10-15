import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !hasRole(user, ["ADMIN"])) {
      return NextResponse.json(
        { error: "Forbidden: Administrative privilege required" },
        { status: 403 }
      );
    }

    const logs = db.prepare(`
      SELECT id, actor_id, actor_email, actor_role, action,
             resource_type, resource_id, details, ip_address, status, created_at
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 100
    `).all();

    return NextResponse.json({ logs });
  } catch (err) {
    console.error("Audit log fetch error:", err);
    return NextResponse.json(
      { error: "Internal server error fetching audit logs" },
      { status: 500 }
    );
  }
}
