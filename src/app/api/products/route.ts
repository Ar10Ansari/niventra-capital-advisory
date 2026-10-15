import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    const user = await getCurrentUser();
    let query = "SELECT * FROM products";
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      query += " WHERE status = 'PUBLISHED'";
    }
    query += " ORDER BY created_at DESC";

    const rows = db.prepare(query).all();
    return NextResponse.json({ products: rows });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Administrator authorization required." }, { status: 403 });
    }

    const body = await req.json();
    const { slug, title, category, indicativeYield, tenor, minInvestment, securityType, summary, description, risksSummary } = body;

    if (!slug || !title || !indicativeYield || !tenor) {
      return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
    }

    const id = `prod_${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO products (
        id, slug, title, category, indicative_yield, tenor,
        min_investment, security_type, status, summary, description, risks_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED', ?, ?, ?)
    `);

    stmt.run(
      id,
      slug.trim().toLowerCase(),
      title.trim(),
      category || "DEBENTURE",
      indicativeYield,
      tenor,
      minInvestment || "₹10,00,000",
      securityType || "Secured (ROC Form CHG-9)",
      summary || "",
      description || "",
      risksSummary || ""
    );

    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "PRODUCT_CREATED",
      resourceType: "PRODUCT",
      resourceId: id,
      details: { slug, title, indicativeYield },
    });

    return NextResponse.json({ success: true, productId: id, message: "Product published successfully." });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
