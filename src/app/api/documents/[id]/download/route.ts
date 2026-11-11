import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";

interface DocumentRow {
  id: string;
  title: string;
  doc_type: string;
  file_path: string;
  mime_type: string;
  is_public: number;
  status: string;
}

const MIME_EXTENSIONS: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "text/plain": ".txt",
  "image/png": ".png",
  "image/jpeg": ".jpg",
};

function buildDownloadFilename(title: string, mimeType: string): string {
  const ext = MIME_EXTENSIONS[mimeType] || ".bin";
  const base = title.replace(/[\r\n"\\/:*?<>|]+/g, "_").trim() || "document";
  return base.toLowerCase().endsWith(ext) ? base : `${base}${ext}`;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    const stmt = db.prepare("SELECT * FROM documents WHERE id = ?");
    const doc = stmt.get(id) as DocumentRow | undefined;

    if (!doc) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    const isPrivileged = Boolean(user && (user.role === "ADMIN" || user.role === "STAFF"));

    // Permission check: Public docs can be downloaded by anyone; private docs require authorized session
    if (!doc.is_public && !user) {
      logAuditEvent({
        actorEmail: "ANONYMOUS",
        action: "DOCUMENT_DOWNLOAD_DENIED",
        resourceType: "DOCUMENT",
        resourceId: id,
        status: "BLOCKED",
        details: { reason: "Unauthenticated request for private document" },
      });
      return NextResponse.json({ error: "Authentication required to access this document." }, { status: 401 });
    }

    if (doc.status !== "APPROVED" && !isPrivileged) {
      logAuditEvent({
        actorId: user?.id || null,
        actorEmail: user?.email || "ANONYMOUS",
        actorRole: user?.role || "PUBLIC",
        action: "DOCUMENT_DOWNLOAD_DENIED",
        resourceType: "DOCUMENT",
        resourceId: id,
        status: "BLOCKED",
        details: { reason: `Document status "${doc.status}" restricts access` },
      });
      return NextResponse.json({ error: "Document is not approved for distribution." }, { status: 403 });
    }

    if (!doc.is_public && user && user.role === "PUBLIC") {
      logAuditEvent({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: "DOCUMENT_DOWNLOAD_DENIED",
        resourceType: "DOCUMENT",
        resourceId: id,
        status: "BLOCKED",
        details: { reason: "PUBLIC role restricted from private documents" },
      });
      return NextResponse.json({ error: "Insufficient role permissions for private document." }, { status: 403 });
    }

    // Resolve storage file safely within storage/documents to prevent path traversal
    const safeBaseDir = path.join(process.cwd(), "storage", "documents");
    const fileName = path.basename(doc.file_path);
    const resolvedPath = path.join(safeBaseDir, fileName);

    // Audit log
    logAuditEvent({
      actorId: user?.id || null,
      actorEmail: user?.email || "PUBLIC_GUEST",
      actorRole: user?.role || "PUBLIC",
      action: "DOCUMENT_DOWNLOADED",
      resourceType: "DOCUMENT",
      resourceId: id,
      details: { title: doc.title, isPublic: !!doc.is_public },
    });

    // If actual binary exists on disk, stream it with validated MIME extension
    if (fs.existsSync(resolvedPath)) {
      const fileBuffer = fs.readFileSync(resolvedPath);
      const effectiveMime = doc.mime_type || "application/pdf";
      const safeDownloadName = buildDownloadFilename(doc.title, effectiveMime);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": effectiveMime,
          "Content-Disposition": `attachment; filename="${encodeURIComponent(safeDownloadName)}"`,
          "X-Content-Type-Options": "nosniff",
          ...(doc.is_public ? {} : { "Cache-Control": "private, no-store" }),
        },
      });
    }

    // Institutional fallback response for pending watermarked files
    return NextResponse.json({
      success: true,
      documentId: id,
      title: doc.title,
      status: "APPROVED_PENDING_COUNSEL_WATERMARK",
      notice:
        "Official Information Memorandum and Term Sheet binaries are currently released in watermarked format directly to accredited capital providers upon NDA execution. Please contact our advisory desk at info@niventracapitaladvisory.com to request an encrypted copy.",
    });
  } catch (error) {
    console.error("Document download error:", error);
    return NextResponse.json({ error: "Failed to download document." }, { status: 500 });
  }
}
