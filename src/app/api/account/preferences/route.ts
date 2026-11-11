import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      preferences: {
        notifyConsultations: Boolean(user.notify_consultations),
        notifyDisclosures: Boolean(user.notify_disclosures),
        notifyGrievances: Boolean(user.notify_grievances),
      },
    });
  } catch (error) {
    console.error("Fetch preferences error:", error);
    return NextResponse.json({ error: "Failed to load preferences." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const { notifyConsultations, notifyDisclosures, notifyGrievances } = body;

    if (
      typeof notifyConsultations !== "boolean" &&
      typeof notifyDisclosures !== "boolean" &&
      typeof notifyGrievances !== "boolean"
    ) {
      return NextResponse.json(
        { error: "At least one boolean notification preference is required." },
        { status: 400 }
      );
    }

    const nextConsultations =
      typeof notifyConsultations === "boolean"
        ? (notifyConsultations ? 1 : 0)
        : user.notify_consultations;
    const nextDisclosures =
      typeof notifyDisclosures === "boolean"
        ? (notifyDisclosures ? 1 : 0)
        : user.notify_disclosures;
    const nextGrievances =
      typeof notifyGrievances === "boolean"
        ? (notifyGrievances ? 1 : 0)
        : user.notify_grievances;

    db.prepare(`
      UPDATE users
      SET notify_consultations = ?, notify_disclosures = ?, notify_grievances = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(nextConsultations, nextDisclosures, nextGrievances, user.id);

    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "NOTIFICATION_PREFERENCES_UPDATED",
      resourceType: "USER",
      resourceId: user.id,
      details: {
        notifyConsultations: Boolean(nextConsultations),
        notifyDisclosures: Boolean(nextDisclosures),
        notifyGrievances: Boolean(nextGrievances),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Notification preferences updated successfully.",
      preferences: {
        notifyConsultations: Boolean(nextConsultations),
        notifyDisclosures: Boolean(nextDisclosures),
        notifyGrievances: Boolean(nextGrievances),
      },
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json({ error: "Failed to update notification preferences." }, { status: 500 });
  }
}
