import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    const user = await getCurrentUser();
    let query = "SELECT id, title, doc_type, file_size, mime_type, version, is_public, status, created_at FROM documents";
    if (!user || user.role === "PUBLIC") {
      query += " WHERE is_public = 1 AND status = 'APPROVED'";
    } else if (user.role === "INVESTOR") {
      query += " WHERE status = 'APPROVED'";
    }
    query += " ORDER BY created_at DESC";

    const rows = db.prepare(query).all();
    return NextResponse.json({ documents: rows });
  } catch (error) {
    console.error("Fetch documents error:", error);
    return NextResponse.json({ error: "Failed to fetch documents." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Administrator authorization required." }, { status: 403 });
    }

    const body = await req.json();
    const { title, docType, filePath, fileSize, mimeType, isPublic } = body;

    if (!title || !docType) {
      return NextResponse.json({ error: "Document title and type are required." }, { status: 400 });
    }

    const id = `doc_${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO documents (
        id, title, doc_type, file_path, file_size,
        mime_type, version, is_public, status
      ) VALUES (?, ?, ?, ?, ?, ?, '1.0', ?, 'APPROVED')
    `);

    stmt.run(
      id,
      title.trim(),
      docType,
      filePath || `storage/documents/${id}.pdf`,
      fileSize || 1024,
      mimeType || "application/pdf",
      isPublic ? 1 : 0
    );

    logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "DOCUMENT_REGISTERED",
      resourceType: "DOCUMENT",
      resourceId: id,
      details: { title, docType, isPublic },
    });

    return NextResponse.json({ success: true, documentId: id, message: "Document registered successfully." });
  } catch (error) {
    console.error("Register document error:", error);
    return NextResponse.json({ error: "Failed to register document." }, { status: 500 });
  }
}
