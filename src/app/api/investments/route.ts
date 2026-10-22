import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export interface InvestmentSummary {
  totalPrincipal: number;
  activeCount: number;
  accruedInterest: number;
  interestPaid: number;
  pendingInterest: number;
  nextPayoutDate: string | null;
  currency: "INR";
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId");
    const statusFilter = searchParams.get("status");

    // Strict Cross-Investor Authorization Check:
    // Regular investors can ONLY query their own records.
    if (user.role === "INVESTOR" && targetUserId && targetUserId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You cannot access investments of another investor." },
        { status: 403 }
      );
    }

    let query = `
      SELECT i.*, p.slug as product_slug, p.security_type
      FROM investments i
      LEFT JOIN products p ON i.product_id = p.id
    `;
    const params: (string | number)[] = [];
    const conditions: string[] = [];

    if (user.role === "ADMIN" || user.role === "STAFF") {
      if (targetUserId) {
        conditions.push("i.user_id = ?");
        params.push(targetUserId);
      }
    } else {
      conditions.push("i.user_id = ?");
      params.push(user.id);
    }

    if (statusFilter && statusFilter !== "ALL") {
      conditions.push("i.status = ?");
      params.push(statusFilter);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY i.created_at DESC";

    const rows = db.prepare(query).all(...params) as Array<{
      id: string;
      user_id: string;
      product_id: string | null;
      product_title: string;
      principal_amount: number;
      interest_rate_pa: number;
      tenor_months: number;
      payout_frequency: string;
      start_date: string;
      maturity_date: string;
      accrued_interest: number;
      interest_paid: number;
      pending_interest: number;
      next_payout_date: string | null;
      status: string;
      is_demo: number;
      created_at: string;
    }>;

    // Compute separate, rigorous portfolio accounting figures
    let totalPrincipal = 0;
    let activeCount = 0;
    let accruedInterest = 0;
    let interestPaid = 0;
    let pendingInterest = 0;
    let earliestPayout: string | null = null;

    for (const inv of rows) {
      if (inv.status === "ACTIVE") {
        activeCount++;
        totalPrincipal += inv.principal_amount;
        accruedInterest += inv.accrued_interest;
        interestPaid += inv.interest_paid;
        pendingInterest += inv.pending_interest;

        if (inv.next_payout_date) {
          if (!earliestPayout || inv.next_payout_date < earliestPayout) {
            earliestPayout = inv.next_payout_date;
          }
        }
      }
    }

    const summary: InvestmentSummary = {
      totalPrincipal,
      activeCount,
      accruedInterest,
      interestPaid,
      pendingInterest,
      nextPayoutDate: earliestPayout,
      currency: "INR",
    };

    return NextResponse.json({
      success: true,
      investments: rows,
      summary,
    });
  } catch (error) {
    console.error("Fetch investments error:", error);
    return NextResponse.json({ error: "Failed to fetch investments." }, { status: 500 });
  }
}
