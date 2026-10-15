import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phoneNumber, category, capitalRange, message, consent } = body;

    if (!fullName || !email || !phoneNumber) {
      return NextResponse.json(
        { error: "Full legal name, email, and phone number are required." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "DPDP Act data processing consent is required to proceed." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();

    // Generate unique serialized ID: ENQ-2026-0001
    const countRow = db.prepare("SELECT COUNT(*) as count FROM enquiries").get() as { count: number };
    const nextSeq = (countRow?.count || 0) + 1;
    const refId = `ENQ-2026-${String(nextSeq).padStart(4, "0")}`;

    const stmt = db.prepare(`
      INSERT INTO enquiries (
        id, user_id, full_name, email, phone_number,
        category, capital_range, message, consent, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'NEW')
    `);

    stmt.run(
      refId,
      currentUser?.id || null,
      fullName.trim(),
      email.trim().toLowerCase(),
      phoneNumber.trim(),
      category || "Capital Provider / Investor",
      capitalRange || "₹25 Lakh – ₹1 Crore",
      message?.trim() || null
    );

    // Write audit event
    logAuditEvent({
      actorId: currentUser?.id || null,
      actorEmail: email.trim().toLowerCase(),
      actorRole: currentUser?.role || "PUBLIC",
      action: "ENQUIRY_SUBMITTED",
      resourceType: "ENQUIRY",
      resourceId: refId,
      details: {
        category,
        capitalRange,
        hasUserAccount: !!currentUser,
      },
    });

    // Notify user via local email sink & in-app if registered
    if (currentUser) {
      sendNotification({
        userId: currentUser.id,
        title: `Enquiry Received: ${refId}`,
        message: `Your consultation enquiry (${category}) has been logged. Our advisory desk will review and contact you within one business day.`,
        type: "ENQUIRY",
        link: `/dashboard/enquiries/`,
        emailNotification: {
          to: email.trim().toLowerCase(),
          subject: `Niventra Advisory Enquiry Acknowledgment — ${refId}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      referenceId: refId,
      message: "Enquiry successfully logged in advisory registry.",
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry." }, { status: 500 });
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
      // Admin/Staff sees all enquiries
      let query = `
        SELECT e.*, u.name as assigned_to_name
        FROM enquiries e
        LEFT JOIN users u ON e.assigned_to = u.id
      `;
      const params: string[] = [];

      if (statusFilter && statusFilter !== "ALL") {
        query += " WHERE e.status = ?";
        params.push(statusFilter);
      }
      query += " ORDER BY e.created_at DESC";

      const rows = db.prepare(query).all(...params);
      return NextResponse.json({ enquiries: rows });
    } else {
      // Investor sees only their own enquiries
      const stmt = db.prepare(`
        SELECT id, category, capital_range, message, status, created_at, updated_at
        FROM enquiries
        WHERE user_id = ? OR email = ?
        ORDER BY created_at DESC
      `);
      const rows = stmt.all(user.id, user.email);
      return NextResponse.json({ enquiries: rows });
    }
  } catch (error) {
    console.error("Fetch enquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries." }, { status: 500 });
  }
}
