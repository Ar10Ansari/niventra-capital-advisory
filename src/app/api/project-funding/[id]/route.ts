import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAudit } from "@/lib/audit";

const VALID_STATUSES = [
  "RECEIVED",
  "UNDER_REVIEW",
  "MORE_INFORMATION_REQUIRED",
  "SHORTLISTED",
  "DECLINED",
  "CLOSED",
];

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/project-funding/[id]
 * Fetch single project application with full details & history
 */
export async function GET(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();

    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const application = db.prepare(`
      SELECT * FROM project_applications WHERE id = ?
    `).get(id) as Record<string, unknown> | undefined;

    if (!application) {
      return NextResponse.json({ error: "Project application not found." }, { status: 404 });
    }

    // Parse documents JSON safely
    let documentsList = [];
    try {
      documentsList = JSON.parse(String(application.documents || "[]"));
    } catch {
      documentsList = [];
    }

    // Fetch status change history
    const history = db.prepare(`
      SELECT id, previous_status, new_status, changed_by, change_note, created_at
      FROM project_status_history
      WHERE project_id = ?
      ORDER BY created_at DESC
    `).all(id);

    return NextResponse.json({
      application: {
        ...application,
        documents: documentsList,
      },
      history,
    });
  } catch (err: unknown) {
    console.error("Fetch project details error:", err);
    return NextResponse.json({ error: "Failed to fetch project details." }, { status: 500 });
  }
}

/**
 * PATCH /api/project-funding/[id]
 * Update application status, internal notes, or add review info
 */
export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();

    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const currentApp = db.prepare(`
      SELECT * FROM project_applications WHERE id = ?
    `).get(id) as Record<string, unknown> | undefined;

    if (!currentApp) {
      return NextResponse.json({ error: "Project application not found." }, { status: 404 });
    }

    const body = await req.json();
    const { status, internalNotes, declineReason, infoRequested, changeNote } = body;

    const previousStatus = String(currentApp.status);
    let newStatus = previousStatus;

    if (status) {
      const normalizedStatus = String(status).toUpperCase();
      if (!VALID_STATUSES.includes(normalizedStatus)) {
        return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
      }
      newStatus = normalizedStatus;
    }

    const updatedNotes = internalNotes !== undefined ? String(internalNotes) : currentApp.internal_notes;
    const updatedDeclineReason = declineReason !== undefined ? String(declineReason) : currentApp.decline_reason;
    const updatedInfoRequested = infoRequested !== undefined ? String(infoRequested) : currentApp.info_requested;

    db.prepare(`
      UPDATE project_applications
      SET status = ?,
          internal_notes = ?,
          decline_reason = ?,
          info_requested = ?,
          assigned_to = COALESCE(assigned_to, ?),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newStatus, updatedNotes, updatedDeclineReason, updatedInfoRequested, user.id, id);

    // Record history if status changed or note added
    if (newStatus !== previousStatus || changeNote) {
      db.prepare(`
        INSERT INTO project_status_history (
          id, project_id, previous_status, new_status, changed_by, change_note
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `psh_${crypto.randomUUID().slice(0, 12)}`,
        id,
        previousStatus,
        newStatus,
        user.name || user.email,
        changeNote || `Status updated from ${previousStatus} to ${newStatus}`
      );
    }

    // Audit log
    logAudit({
      actorId: user.id,
      actorRole: user.role,
      actorEmail: user.email,
      action: "PROJECT_FUNDING_STATUS_UPDATED",
      resourceType: "PROJECT_APPLICATION",
      resourceId: id,
      details: JSON.stringify({
        previousStatus,
        newStatus,
        referenceNumber: currentApp.reference_number,
      }),
    });

    return NextResponse.json({
      success: true,
      message: `Project application ${currentApp.reference_number} updated successfully.`,
      status: newStatus,
    });
  } catch (err: unknown) {
    console.error("Update project status error:", err);
    return NextResponse.json({ error: "Failed to update project application." }, { status: 500 });
  }
}
