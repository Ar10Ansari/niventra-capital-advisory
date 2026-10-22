import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";
import { sendNotification } from "@/lib/notifications";

function maskIdNumber(idStr: string): string {
  if (!idStr || idStr.length < 4) return "****";
  const visibleLast4 = idStr.slice(-4);
  return "*".repeat(idStr.length - 4) + visibleLast4;
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId");

    // Cross-investor guard: regular investors can only see their own KYC record
    if (user.role === "INVESTOR" && targetUserId && targetUserId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You cannot access KYC records of another investor." },
        { status: 403 }
      );
    }

    const queryUserId = (user.role === "ADMIN" || user.role === "STAFF") && targetUserId
      ? targetUserId
      : user.id;

    const row = db.prepare(`
      SELECT k.*, u.name as user_name, u.email as user_email
      FROM kyc_records k
      JOIN users u ON k.user_id = u.id
      WHERE k.user_id = ?
    `).get(queryUserId) as Record<string, unknown> | undefined;

    if (!row) {
      return NextResponse.json({
        success: true,
        kyc: null,
        status: "NOT_SUBMITTED",
      });
    }

    return NextResponse.json({
      success: true,
      kyc: row,
      status: row.status,
    });
  } catch (error) {
    console.error("Fetch KYC error:", error);
    return NextResponse.json({ error: "Failed to fetch KYC record." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const { panNumber, idType, idNumber, consent } = body;

    if (!panNumber || !idType || !idNumber) {
      return NextResponse.json(
        { error: "PAN number, identity document type, and document number are required." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "DPDP Act consent is mandatory for regulatory identity verification." },
        { status: 400 }
      );
    }

    const cleanPan = panNumber.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(cleanPan)) {
      return NextResponse.json(
        { error: "Invalid PAN format. Standard format is 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)." },
        { status: 400 }
      );
    }

    const maskedPan = `${cleanPan.slice(0, 2)}*****${cleanPan.slice(-2)}`;
    const maskedId = maskIdNumber(idNumber.trim());
    const kycId = `kyc_${Date.now()}_${randomBytes(4).toString("hex")}`;

    // Upsert KYC record
    const existing = db.prepare("SELECT id FROM kyc_records WHERE user_id = ?").get(user.id) as { id: string } | undefined;

    if (existing) {
      db.prepare(`
        UPDATE kyc_records
        SET pan_number_masked = ?, id_type = ?, id_number_masked = ?, status = 'PENDING_VERIFICATION',
            dpdp_consent = 1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).run(maskedPan, idType, maskedId, user.id);
    } else {
      db.prepare(`
        INSERT INTO kyc_records (
          id, user_id, pan_number_masked, id_type, id_number_masked, status, dpdp_consent
        ) VALUES (?, ?, ?, ?, ?, 'PENDING_VERIFICATION', 1)
      `).run(kycId, user.id, maskedPan, idType, maskedId);
    }

    // Log immutable audit event
    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "KYC_SUBMITTED",
      resourceType: "KYC",
      resourceId: existing ? existing.id : kycId,
      details: { maskedPan, idType },
    });

    return NextResponse.json({
      success: true,
      message: "KYC documentation submitted for institutional compliance verification.",
      status: "PENDING_VERIFICATION",
    });
  } catch (error) {
    console.error("Submit KYC error:", error);
    return NextResponse.json({ error: "Failed to submit KYC record." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized: Administrator privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { userId, status, rejectionReason } = body;

    if (!userId || !status) {
      return NextResponse.json({ error: "User ID and new status are required." }, { status: 400 });
    }

    if (!["VERIFIED", "REJECTED", "PENDING_VERIFICATION"].includes(status)) {
      return NextResponse.json({ error: "Invalid KYC status." }, { status: 400 });
    }

    const existing = db.prepare("SELECT * FROM kyc_records WHERE user_id = ?").get(userId) as Record<string, unknown> | undefined;
    if (!existing) {
      return NextResponse.json({ error: "KYC record not found for user." }, { status: 404 });
    }

    const verifiedAt = status === "VERIFIED" ? new Date().toISOString() : null;
    const reason = status === "REJECTED" ? (rejectionReason || "Identity document mismatch") : null;

    db.prepare(`
      UPDATE kyc_records
      SET status = ?, verified_at = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(status, verifiedAt, reason, userId);

    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "KYC_STATUS_UPDATED",
      resourceType: "KYC",
      resourceId: existing.id as string,
      details: { previousStatus: existing.status, newStatus: status, reason },
    });

    // Notify user of verification outcome
    sendNotification({
      userId,
      title: `KYC Compliance Status: ${status}`,
      message: status === "VERIFIED"
        ? "Your institutional KYC documents have been reviewed and verified by compliance."
        : `Your KYC submission was not approved: ${reason}. Please update your identity details.`,
      type: "SYSTEM",
      link: "/dashboard/settings/",
    });

    return NextResponse.json({
      success: true,
      message: `KYC status transitioned to ${status}.`,
    });
  } catch (error) {
    console.error("Update KYC error:", error);
    return NextResponse.json({ error: "Failed to update KYC status." }, { status: 500 });
  }
}
