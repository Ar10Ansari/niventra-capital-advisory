import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { complainantName, email, phone, transactionRef, subject, description } = body;

    if (!complainantName || !email || !phone || !subject || !description) {
      return NextResponse.json(
        { error: "Complainant name, email, phone, subject, and description are required." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();

    // Generate unique serialized ID: GRV-2026-0001
    const countRow = db.prepare("SELECT COUNT(*) as count FROM grievances").get() as { count: number };
    const nextSeq = (countRow?.count || 0) + 1;
    const refId = `GRV-2026-${String(nextSeq).padStart(4, "0")}`;

    // SLA: 30 days resolution deadline
    const slaDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const stmt = db.prepare(`
      INSERT INTO grievances (
        id, user_id, complainant_name, email, phone,
        transaction_ref, subject, description, status, sla_deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', ?)
    `);

    stmt.run(
      refId,
      currentUser?.id || null,
      complainantName.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      transactionRef?.trim() || null,
      subject.trim(),
      description.trim(),
      slaDeadline
    );

    // Audit log
    logAuditEvent({
      actorId: currentUser?.id || null,
      actorEmail: email.trim().toLowerCase(),
      actorRole: currentUser?.role || "PUBLIC",
      action: "GRIEVANCE_LODGED",
      resourceType: "GRIEVANCE",
      resourceId: refId,
      details: { subject, hasTransactionRef: !!transactionRef },
    });

    // Notify complainant via local email sink & in-app if registered
    if (currentUser) {
      sendNotification({
        userId: currentUser.id,
        title: `Grievance Ticket Lodged: ${refId}`,
        message: `Your grievance regarding "${subject}" has been registered. Our Grievance Redressal Officer will acknowledge within 48 business hours.`,
        type: "GRIEVANCE",
        link: `/dashboard/grievances/`,
        emailNotification: {
          to: email.trim().toLowerCase(),
          subject: `Formal Grievance Ticket Acknowledgment — ${refId}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      ticketId: refId,
      slaDeadline,
      message: "Grievance successfully registered with Grievance Redressal Officer.",
    });
  } catch (error) {
    console.error("Grievance submission error:", error);
    return NextResponse.json({ error: "Failed to submit grievance." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    if (user.role === "ADMIN" || user.role === "STAFF") {
      let query = `
        SELECT g.*, u.name as assigned_to_name
        FROM grievances g
        LEFT JOIN users u ON g.assigned_to = u.id
      `;
      const params: string[] = [];

      if (statusFilter && statusFilter !== "ALL") {
        query += " WHERE g.status = ?";
        params.push(statusFilter);
      }
      query += " ORDER BY g.created_at DESC";

      const rows = db.prepare(query).all(...params);
      return NextResponse.json({ grievances: rows });
    } else {
      const stmt = db.prepare(`
        SELECT id, subject, description, status, sla_deadline, resolution_notes, created_at, updated_at
        FROM grievances
        WHERE user_id = ? OR email = ?
        ORDER BY created_at DESC
      `);
      const rows = stmt.all(user.id, user.email);
      return NextResponse.json({ grievances: rows });
    }
  } catch (error) {
    console.error("Fetch grievances error:", error);
    return NextResponse.json({ error: "Failed to fetch grievances." }, { status: 500 });
  }
}
