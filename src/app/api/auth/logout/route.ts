import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, invalidateSession, getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const user = await getCurrentUser();

    if (token) {
      invalidateSession(token);
    }

    if (user) {
      logAuditEvent({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: "AUTH_LOGOUT",
        resourceType: "SESSION",
        status: "SUCCESS",
      });
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully." });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
