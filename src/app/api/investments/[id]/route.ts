import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { id } = await params;

    const investment = db.prepare(`
      SELECT i.*, p.slug as product_slug, p.security_type, p.summary as product_summary, p.risks_summary
      FROM investments i
      LEFT JOIN products p ON i.product_id = p.id
      WHERE i.id = ?
    `).get(id) as Record<string, unknown> | undefined;

    if (!investment) {
      return NextResponse.json({ error: "Investment record not found." }, { status: 404 });
    }

    // Strict Cross-Investor Check:
    // Only the owning investor or ADMIN/STAFF can view this record.
    if (investment.user_id !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to view this investment." },
        { status: 403 }
      );
    }

    // Fetch related ledger transactions
    const transactions = db.prepare(`
      SELECT *
      FROM investment_transactions
      WHERE investment_id = ?
      ORDER BY effective_date DESC
    `).all(id);

    return NextResponse.json({
      success: true,
      investment,
      transactions,
    });
  } catch (error) {
    console.error("Fetch investment details error:", error);
    return NextResponse.json({ error: "Failed to fetch investment details." }, { status: 500 });
  }
}
