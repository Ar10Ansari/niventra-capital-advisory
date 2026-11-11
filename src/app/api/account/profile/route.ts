import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";

const ALLOWED_INVESTOR_CATEGORIES = new Set(["HNI", "FAMILY_OFFICE", "CORPORATE", "INSTITUTIONAL"]);

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, investorCategory } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Legal full name is required (min 2 characters)." }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone ? String(phone).trim() : null;

    let normalizedCategory = user.investor_category;
    if (investorCategory !== undefined) {
      const cat = typeof investorCategory === "string" ? investorCategory.trim().toUpperCase() : "";
      if (!cat) {
        normalizedCategory = null;
      } else if (ALLOWED_INVESTOR_CATEGORIES.has(cat)) {
        normalizedCategory = cat;
      } else {
        return NextResponse.json({ error: "Unsupported investor category selection." }, { status: 400 });
      }
    }

    db.prepare(`
      UPDATE users
      SET name = ?, phone = ?, investor_category = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(trimmedName, trimmedPhone, normalizedCategory, user.id);

    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "USER_PROFILE_UPDATED",
      resourceType: "USER",
      resourceId: user.id,
      details: { updatedFields: ["name", "phone", ...(investorCategory !== undefined ? ["investorCategory"] : [])] },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        ...user,
        name: trimmedName,
        phone: trimmedPhone,
        investor_category: normalizedCategory,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
