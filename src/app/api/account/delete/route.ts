import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { logAuditEvent } from "@/lib/audit";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { fullName, email, phone, reason, password } = body;

    const requestEmail = user ? user.email : email?.trim().toLowerCase();
    const requestName = user ? user.name : fullName?.trim();
    const requestPhone = user ? user.phone || phone?.trim() : phone?.trim();

    if (!requestEmail || !requestName || !requestPhone) {
      return NextResponse.json(
        { error: "Full legal name, email, and phone number are required." },
        { status: 400 }
      );
    }

    // If authenticated, verify password for security
    if (user && password) {
      const userRow = db.prepare("SELECT password_hash, salt FROM users WHERE id = ?").get(user.id) as {
        password_hash: string;
        salt: string;
      };
      if (userRow && !verifyPassword(password, userRow.password_hash, userRow.salt)) {
        return NextResponse.json({ error: "Incorrect password verification." }, { status: 403 });
      }
    }

    // Generate serialized request ID: DEL-2026-0001
    const countRow = db.prepare("SELECT COUNT(*) as count FROM deletion_requests").get() as { count: number };
    const nextSeq = (countRow?.count || 0) + 1;
    const refId = `DEL-2026-${String(nextSeq).padStart(4, "0")}`;

    const stmt = db.prepare(`
      INSERT INTO deletion_requests (
        id, user_id, full_name, email, phone, reason, status, statutory_retention_notes
      ) VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?)
    `);

    const retentionNotes =
      "Subject to mandatory financial record retention (Companies Act 2013: 8 years for debenture registers; PMLA 2002: 5 years for CDD records; Income Tax Act 1961: audit assessment periods). Marketing and prospective enquiry profiles queued for purging.";

    stmt.run(
      refId,
      user?.id || null,
      requestName,
      requestEmail,
      requestPhone,
      reason?.trim() || null,
      retentionNotes
    );

    // If registered user, update status to PENDING_DELETION
    if (user) {
      db.prepare("UPDATE users SET status = 'PENDING_DELETION' WHERE id = ?").run(user.id);
    }

    // Audit log
    logAuditEvent({
      actorId: user?.id || null,
      actorEmail: requestEmail,
      actorRole: user?.role || "PUBLIC",
      action: "ACCOUNT_DELETION_REQUESTED",
      resourceType: "DATA_ERASURE",
      resourceId: refId,
      details: { statutoryRetentionNotes: retentionNotes },
    });

    // Notify user via local email sink
    if (user) {
      sendNotification({
        userId: user.id,
        title: `Data Erasure Request Received: ${refId}`,
        message: `Your request for personal data erasure has been queued (SLA: 7–14 business days). You will receive final confirmation once verified.`,
        type: "SECURITY",
        link: "/dashboard/security/",
        emailNotification: {
          to: requestEmail,
          subject: `Data Erasure Request Confirmation — ${refId}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      requestId: refId,
      slaDays: "7 to 14 Business Days",
      message: "Data erasure request successfully queued under DPDP Act 2023.",
    });
  } catch (error) {
    console.error("Account deletion request error:", error);
    return NextResponse.json({ error: "Failed to queue erasure request." }, { status: 500 });
  }
}
