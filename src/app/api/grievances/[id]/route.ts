import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";
import { sendNotification } from "@/lib/notifications";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, assignedTo, resolutionNotes } = body;

    const existing = db.prepare("SELECT * FROM grievances WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!existing) {
      return NextResponse.json({ error: "Grievance ticket not found." }, { status: 404 });
    }

    const updates: string[] = [];
    const values: (string | null)[] = [];

    if (status) {
      updates.push("status = ?");
      values.push(status);
    }
    if (assignedTo !== undefined) {
      updates.push("assigned_to = ?");
      values.push(assignedTo || null);
    }
    if (resolutionNotes !== undefined) {
      updates.push("resolution_notes = ?");
      values.push(resolutionNotes);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    const sql = `UPDATE grievances SET ${updates.join(", ")} WHERE id = ?`;
    db.prepare(sql).run(...values);

    // Audit log
    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "GRIEVANCE_UPDATED",
      resourceType: "GRIEVANCE",
      resourceId: id,
      details: { previousStatus: existing.status, newStatus: status, assignedTo },
    });

    // Notify complainant if status changed and user account exists
    if (status && status !== existing.status && existing.user_id) {
      sendNotification({
        userId: existing.user_id as string,
        title: `Grievance Status Update: ${id}`,
        message: `Your grievance ticket status has transitioned to "${status}".`,
        type: "GRIEVANCE",
        link: "/dashboard/grievances/",
      });
    }

    return NextResponse.json({ success: true, message: "Grievance ticket updated successfully." });
  } catch (error) {
    console.error("Update grievance error:", error);
    return NextResponse.json({ error: "Failed to update grievance ticket." }, { status: 500 });
  }
}
