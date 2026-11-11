import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as path from "node:path";
import { randomBytes } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import {
  MIME_EXTENSION_MAP,
  StorageAdapter,
  getCanonicalExtensionForMime,
  isBufferValidForMime,
  sanitizeDownloadFilename,
} from "./storage/storage.adapter";
import { CreateDocumentDto, MAX_DOCUMENT_SIZE_BYTES } from "./dto/document.dto";

export interface DocumentItemDto {
  id: string;
  title: string;
  doc_type: string;
  file_size: number;
  mime_type: string;
  version: string;
  is_public: number;
  status: string;
  created_at: string;
}

export type DocumentDownloadOutcome =
  | {
      mode: "FILE";
      buffer: Buffer;
      mimeType: string;
      downloadFilename: string;
      isPublic: boolean;
    }
  | {
      mode: "NOTICE";
      isPublic: boolean;
      payload: {
        success: boolean;
        documentId: string;
        title: string;
        status: string;
        storageDriver: string;
        notice: string;
      };
    };

export interface DocumentAccessRecord {
  id: string;
  title: string;
  docType?: string;
  filePath: string;
  fileSize?: number;
  mimeType: string;
  version?: string;
  isPublic: boolean;
  status: string;
  ownerId?: string | null;
}

export interface UploadedBinaryInput {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

const AUTHORIZED_PRIVATE_ROLES = new Set(["INVESTOR", "STAFF", "ADMIN"]);
const PRIVILEGED_STAFF_ROLES = new Set(["STAFF", "ADMIN"]);

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageAdapter,
    private readonly auditLogs: AuditLogsService
  ) {}

  private extractOwnerId(doc: DocumentAccessRecord): string | null {
    if (doc.ownerId && typeof doc.ownerId === "string") {
      return doc.ownerId;
    }
    const normalizedPath = String(doc.filePath || "").replace(/\\/g, "/");
    const match = normalizedPath.match(/(?:^|\/)owners\/([a-zA-Z0-9_-]+)\//);
    return match ? match[1] : null;
  }

  private async assertCanAccessDocument(
    doc: DocumentAccessRecord,
    user: AuthenticatedUser | null,
    actionName: string
  ): Promise<void> {
    const isPrivileged = Boolean(user && PRIVILEGED_STAFF_ROLES.has(user.role));

    if (!doc.isPublic && !user) {
      await this.auditLogs.logEvent({
        actorEmail: "ANONYMOUS",
        action: actionName,
        resourceType: "DOCUMENT",
        resourceId: doc.id,
        status: "BLOCKED",
        details: { reason: "Unauthenticated request for private document" },
      });
      throw new UnauthorizedException("Authentication required to access this document.");
    }

    if (doc.status !== "APPROVED" && !isPrivileged) {
      await this.auditLogs.logEvent({
        actorId: user?.id || null,
        actorEmail: user?.email || "ANONYMOUS",
        actorRole: user?.role || "PUBLIC",
        action: actionName,
        resourceType: "DOCUMENT",
        resourceId: doc.id,
        status: "BLOCKED",
        details: { reason: `Document approval status "${doc.status}" restricts user access` },
      });
      if (!user) {
        throw new UnauthorizedException("Authentication required to access unapproved document.");
      }
      throw new ForbiddenException("This document is not approved for investor or public distribution.");
    }

    if (!doc.isPublic && user && !AUTHORIZED_PRIVATE_ROLES.has(user.role)) {
      await this.auditLogs.logEvent({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: actionName,
        resourceType: "DOCUMENT",
        resourceId: doc.id,
        status: "BLOCKED",
        details: { reason: "Account role lacks private document authorization" },
      });
      throw new ForbiddenException("Your account role is not authorized to access private documents.");
    }

    const ownerId = this.extractOwnerId(doc);
    if (ownerId && user && !isPrivileged && user.id !== ownerId) {
      await this.auditLogs.logEvent({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: actionName,
        resourceType: "DOCUMENT",
        resourceId: doc.id,
        status: "BLOCKED",
        details: { reason: "Cross-investor document ownership violation" },
      });
      throw new ForbiddenException("Forbidden: You are not authorized to access another investor's document.");
    }
  }

  private assertMimeMatchesPath(filePath: string, mimeType: string): void {
    const allowedExts = MIME_EXTENSION_MAP[mimeType];
    if (!allowedExts) {
      throw new BadRequestException("Unsupported document MIME content type.");
    }
    const ext = path.posix.extname(filePath.toLowerCase());
    if (!ext || !allowedExts.includes(ext)) {
      throw new BadRequestException(
        `File extension "${ext || "none"}" does not match MIME type "${mimeType}".`
      );
    }
  }

  private formatDoc(doc: {
    id: string;
    title: string;
    docType: string;
    fileSize: number;
    mimeType: string;
    version: string;
    isPublic: boolean;
    status: string;
    createdAt: Date;
  }): DocumentItemDto {
    return {
      id: doc.id,
      title: doc.title,
      doc_type: doc.docType,
      file_size: doc.fileSize,
      mime_type: doc.mimeType,
      version: doc.version,
      is_public: doc.isPublic ? 1 : 0,
      status: doc.status,
      created_at: doc.createdAt.toISOString(),
    };
  }

  async listDocuments(user: AuthenticatedUser | null): Promise<{ documents: DocumentItemDto[] }> {
    const where: Prisma.DocumentWhereInput = {};
    if (!user || user.role === "PUBLIC") {
      where.isPublic = true;
      where.status = "APPROVED";
    } else if (user.role === "INVESTOR") {
      where.status = "APPROVED";
    }

    const rows = await this.prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Exclude investor-owned private files belonging to other investors
    const visible = rows.filter((row) => {
      const ownerId = this.extractOwnerId(row);
      if (!ownerId || !user || PRIVILEGED_STAFF_ROLES.has(user.role)) {
        return true;
      }
      return ownerId === user.id;
    });

    return {
      documents: visible.map((row) => this.formatDoc(row)),
    };
  }

  async registerDocument(dto: CreateDocumentDto, actor: AuthenticatedUser) {
    const id = `doc_${Date.now()}_${randomBytes(3).toString("hex")}`;
    const mimeType = dto.mimeType || "application/pdf";
    const ext = getCanonicalExtensionForMime(mimeType);

    let safeFilePath: string;
    if (dto.filePath) {
      if (dto.filePath.includes("..") || dto.filePath.includes("\0")) {
        throw new BadRequestException("Blocked unsafe document file path.");
      }
      const cleanRaw = dto.filePath.replace(/^\/+/, "");
      this.assertMimeMatchesPath(cleanRaw, mimeType);
      safeFilePath = cleanRaw.startsWith("storage/documents/")
        ? cleanRaw
        : `storage/documents/${cleanRaw}`;
    } else if (dto.ownerId) {
      safeFilePath = `storage/documents/owners/${dto.ownerId}/${id}${ext}`;
    } else {
      safeFilePath = `storage/documents/${id}${ext}`;
    }

    const resolvedSize = dto.fileSize ?? 1024;
    if (resolvedSize < 1 || resolvedSize > MAX_DOCUMENT_SIZE_BYTES) {
      throw new BadRequestException("Document size out of permitted bounds (1B – 15MB).");
    }

    const created = await this.prisma.document.create({
      data: {
        id,
        title: dto.title.trim(),
        docType: dto.docType,
        filePath: safeFilePath,
        fileSize: resolvedSize,
        mimeType,
        version: dto.version || "1.0",
        isPublic: Boolean(dto.isPublic),
        status: dto.status || "APPROVED",
      },
    });

    await this.auditLogs.logEvent({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: "DOCUMENT_REGISTERED",
      resourceType: "DOCUMENT",
      resourceId: created.id,
      details: {
        title: created.title,
        docType: created.docType,
        mimeType: created.mimeType,
        isPublic: created.isPublic,
        status: created.status,
      },
    });

    return {
      success: true,
      documentId: created.id,
      message: "Document registered successfully.",
    };
  }

  async uploadDocumentBinary(
    file: UploadedBinaryInput | undefined,
    dto: CreateDocumentDto,
    actor: AuthenticatedUser
  ) {
    if (!file || !Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
      throw new BadRequestException("Document file binary payload is required.");
    }
    if (file.buffer.length > MAX_DOCUMENT_SIZE_BYTES) {
      throw new BadRequestException("Uploaded document exceeds maximum allowed size of 15 MB.");
    }

    const declaredMime = dto.mimeType || file.mimetype;
    if (!MIME_EXTENSION_MAP[declaredMime]) {
      throw new BadRequestException("Unsupported file MIME type.");
    }
    this.assertMimeMatchesPath(file.originalname || "", declaredMime);

    if (!isBufferValidForMime(file.buffer, declaredMime)) {
      throw new BadRequestException("File binary header does not match its declared MIME type.");
    }

    const id = `doc_${Date.now()}_${randomBytes(3).toString("hex")}`;
    const ext = getCanonicalExtensionForMime(declaredMime);
    const storageKey = dto.ownerId ? `owners/${dto.ownerId}/${id}${ext}` : `${id}${ext}`;
    const relativeDbPath = `storage/documents/${storageKey}`;

    this.storage.writeLocalDocument(storageKey, file.buffer, declaredMime);

    const created = await this.prisma.document.create({
      data: {
        id,
        title: dto.title.trim(),
        docType: dto.docType,
        filePath: relativeDbPath,
        fileSize: file.buffer.length,
        mimeType: declaredMime,
        version: dto.version || "1.0",
        isPublic: Boolean(dto.isPublic),
        status: dto.status || "APPROVED",
      },
    });

    await this.auditLogs.logEvent({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: "DOCUMENT_UPLOADED",
      resourceType: "DOCUMENT",
      resourceId: created.id,
      details: {
        title: created.title,
        mimeType: created.mimeType,
        fileSize: created.fileSize,
        isPublic: created.isPublic,
        status: created.status,
      },
    });

    return {
      success: true,
      documentId: created.id,
      fileSize: created.fileSize,
      mimeType: created.mimeType,
      message: "Document uploaded and stored safely.",
    };
  }

  async getDocument(id: string, user: AuthenticatedUser | null) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) {
      throw new NotFoundException("Document not found.");
    }
    await this.assertCanAccessDocument(doc, user, "DOCUMENT_ACCESS_DENIED");
    return this.formatDoc(doc);
  }

  async downloadDocument(id: string, user: AuthenticatedUser | null): Promise<DocumentDownloadOutcome> {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) {
      throw new NotFoundException("Document not found.");
    }

    await this.assertCanAccessDocument(doc, user, "DOCUMENT_DOWNLOAD_DENIED");

    await this.auditLogs.logEvent({
      actorId: user?.id || null,
      actorEmail: user?.email || "PUBLIC_GUEST",
      actorRole: user?.role || "PUBLIC",
      action: "DOCUMENT_DOWNLOADED",
      resourceType: "DOCUMENT",
      resourceId: id,
      details: { title: doc.title, isPublic: doc.isPublic, mimeType: doc.mimeType },
    });

    const localRead = this.storage.readLocalDocument(doc.filePath);
    if (localRead.found && localRead.buffer) {
      const effectiveMime = doc.mimeType || "application/pdf";
      if (!isBufferValidForMime(localRead.buffer, effectiveMime)) {
        throw new BadRequestException("Stored document binary failed MIME signature verification.");
      }

      return {
        mode: "FILE",
        buffer: localRead.buffer,
        mimeType: effectiveMime,
        downloadFilename: sanitizeDownloadFilename(doc.title, effectiveMime),
        isPublic: doc.isPublic,
      };
    }

    const storageStatus = this.storage.getProviderStatus();
    return {
      mode: "NOTICE",
      isPublic: doc.isPublic,
      payload: {
        success: true,
        documentId: id,
        title: doc.title,
        status: "APPROVED_PENDING_COUNSEL_WATERMARK",
        storageDriver: storageStatus.driver,
        notice:
          "Official Information Memorandum and Term Sheet binaries are currently released in watermarked format directly to accredited capital providers upon NDA execution. Please contact our advisory desk at info@niventracapitaladvisory.com to request an encrypted copy.",
      },
    };
  }
}
