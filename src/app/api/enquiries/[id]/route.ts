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
    const { status, assignedTo, internalNotes } = body;

    const existing = db.prepare("SELECT * FROM enquiries WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!existing) {
      return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
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
    if (internalNotes !== undefined) {
      updates.push("internal_notes = ?");
      values.push(internalNotes);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    const sql = `UPDATE enquiries SET ${updates.join(", ")} WHERE id = ?`;
    db.prepare(sql).run(...values);

    // Audit log
    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "ENQUIRY_UPDATED",
      resourceType: "ENQUIRY",
      resourceId: id,
      details: { previousStatus: existing.status, newStatus: status, assignedTo },
    });

    // Notify user if status changed and user account exists
    if (status && status !== existing.status && existing.user_id) {
      sendNotification({
        userId: existing.user_id as string,
        title: `Enquiry Status Update: ${id}`,
        message: `Your advisory enquiry status has transitioned to "${status}".`,
        type: "ENQUIRY",
        link: "/dashboard/enquiries/",
      });
    }

    return NextResponse.json({ success: true, message: "Enquiry updated successfully." });
  } catch (error) {
    console.error("Update enquiry error:", error);
    return NextResponse.json({ error: "Failed to update enquiry." }, { status: 500 });
  }
}
