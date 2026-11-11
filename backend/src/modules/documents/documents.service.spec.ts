import { BadRequestException, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { DocumentsService } from "./documents.service";
import { StorageAdapter, isBufferValidForMime, sanitizeDownloadFilename } from "./storage/storage.adapter";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";

describe("DocumentsService & StorageAdapter", () => {
  let service: DocumentsService;
  let storageAdapter: StorageAdapter;
  let tempRoot: string;
  let mockPrisma: {
    document: { findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock };
  };
  let mockAuditLogs: { logEvent: jest.Mock };

  const investor: AuthenticatedUser = {
    id: "usr_inv",
    name: "Investor",
    email: "investor@example.com",
    role: "INVESTOR",
    status: "ACTIVE",
    created_at: "2026-10-01T00:00:00.000Z",
  };

  const otherInvestor: AuthenticatedUser = {
    id: "usr_other",
    name: "Other Investor",
    email: "other@example.com",
    role: "INVESTOR",
    status: "ACTIVE",
    created_at: "2026-10-01T00:00:00.000Z",
  };

  const publicRoleUser: AuthenticatedUser = {
    id: "usr_pub",
    name: "Public User",
    email: "public@example.com",
    role: "PUBLIC",
    status: "ACTIVE",
    created_at: "2026-10-01T00:00:00.000Z",
  };

  const adminUser: AuthenticatedUser = {
    id: "usr_admin",
    name: "Admin",
    email: "admin@niventra.local",
    role: "ADMIN",
    status: "ACTIVE",
    created_at: "2026-10-01T00:00:00.000Z",
  };

  beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "niventra-docs-unit-"));
    const configService = {
      get: jest.fn((key: string) => (key === "STORAGE_ROOT_DIR" ? tempRoot : undefined)),
    } as unknown as ConfigService;

    storageAdapter = new StorageAdapter(configService);
    mockPrisma = {
      document: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    mockAuditLogs = { logEvent: jest.fn().mockResolvedValue(undefined) };

    service = new DocumentsService(
      mockPrisma as unknown as PrismaService,
      storageAdapter,
      mockAuditLogs as unknown as AuditLogsService
    );
  });

  afterEach(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("should block path traversal attempts explicitly and report honest LOCAL_FS status", () => {
    expect(() => storageAdapter.resolveSafeLocalPath("../../../etc/passwd")).toThrow(BadRequestException);

    const safeResolved = storageAdapter.resolveSafeLocalPath("storage/documents/sample.pdf");
    expect(path.dirname(safeResolved)).toBe(path.resolve(tempRoot));
    expect(storageAdapter.getProviderStatus()).toEqual(
      expect.objectContaining({
        driver: "LOCAL_FS",
        remoteDriverImplemented: false,
      })
    );
  });

  it("should validate magic bytes and preserve non-.pdf download filenames", () => {
    expect(isBufferValidForMime(Buffer.from("%PDF-1.7\n"), "application/pdf")).toBe(true);
    expect(isBufferValidForMime(Buffer.from("<html><script>alert(1)</script></html>"), "application/pdf")).toBe(false);
    expect(isBufferValidForMime(Buffer.from("<html>evil</html>"), "text/plain")).toBe(false);
    expect(isBufferValidForMime(Buffer.from("Safe compliance disclosure note"), "text/plain")).toBe(true);

    expect(sanitizeDownloadFilename("Quarterly Compliance Sheet", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).toBe(
      "Quarterly Compliance Sheet.xlsx"
    );
    expect(sanitizeDownloadFilename("Disclosure Summary", "text/plain")).toBe("Disclosure Summary.txt");
  });

  it("should restrict unauthenticated document listing strictly to public approved documents", async () => {
    mockPrisma.document.findMany.mockResolvedValueOnce([]);
    await service.listDocuments(null);

    expect(mockPrisma.document.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isPublic: true, status: "APPROVED" },
      })
    );
  });

  it("should block unauthenticated, PUBLIC-role, and unapproved document access", async () => {
    mockPrisma.document.findUnique.mockResolvedValueOnce({
      id: "doc_pas4_sample",
      title: "Private Placement Offer Letter (PAS-4)",
      filePath: "storage/documents/doc_pas4_sample.pdf",
      mimeType: "application/pdf",
      isPublic: false,
      status: "APPROVED",
    });

    await expect(service.downloadDocument("doc_pas4_sample", null)).rejects.toThrow(
      UnauthorizedException
    );

    mockPrisma.document.findUnique.mockResolvedValueOnce({
      id: "doc_pas4_sample",
      title: "Private Placement Offer Letter (PAS-4)",
      filePath: "storage/documents/doc_pas4_sample.pdf",
      mimeType: "application/pdf",
      isPublic: false,
      status: "APPROVED",
    });

    await expect(service.downloadDocument("doc_pas4_sample", publicRoleUser)).rejects.toThrow(
      ForbiddenException
    );

    mockPrisma.document.findUnique.mockResolvedValueOnce({
      id: "doc_draft",
      title: "Draft Term Sheet",
      filePath: "storage/documents/doc_draft.pdf",
      mimeType: "application/pdf",
      isPublic: true,
      status: "PENDING",
    });

    await expect(service.getDocument("doc_draft", investor)).rejects.toThrow(ForbiddenException);
  });

  it("should enforce investor ownership on owner-scoped private documents while allowing owner & admin", async () => {
    const ownedDoc = {
      id: "doc_owner_1",
      title: "Investor Tax Statement",
      docType: "COMPLIANCE",
      filePath: "storage/documents/owners/usr_inv/statement.txt",
      fileSize: 64,
      mimeType: "text/plain",
      version: "1.0",
      isPublic: false,
      status: "APPROVED",
      createdAt: new Date(),
    };

    mockPrisma.document.findUnique.mockResolvedValueOnce(ownedDoc);
    await expect(service.downloadDocument("doc_owner_1", otherInvestor)).rejects.toThrow(ForbiddenException);

    mockPrisma.document.findUnique.mockResolvedValueOnce(ownedDoc);
    const ownerRes = await service.getDocument("doc_owner_1", investor);
    expect(ownerRes.id).toBe("doc_owner_1");

    mockPrisma.document.findUnique.mockResolvedValueOnce(ownedDoc);
    const adminRes = await service.getDocument("doc_owner_1", adminUser);
    expect(adminRes.id).toBe("doc_owner_1");
  });

  it("should upload safe binary and stream with non-.pdf MIME extension", async () => {
    mockPrisma.document.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      ...data,
      createdAt: new Date(),
    }));

    const uploadRes = await service.uploadDocumentBinary(
      {
        originalname: "audit-note.txt",
        mimetype: "text/plain",
        size: 32,
        buffer: Buffer.from("Verified compliance note text.", "utf-8"),
      },
      {
        title: "Compliance Audit Note",
        docType: "COMPLIANCE",
        mimeType: "text/plain",
        isPublic: false,
      },
      adminUser
    );

    expect(uploadRes.success).toBe(true);
    const createdCall = mockPrisma.document.create.mock.calls[0][0].data as {
      id: string;
      filePath: string;
      title: string;
      mimeType: string;
    };

    mockPrisma.document.findUnique.mockResolvedValueOnce({
      ...createdCall,
      isPublic: false,
      status: "APPROVED",
    });

    const dl = await service.downloadDocument(createdCall.id, investor);
    expect(dl.mode).toBe("FILE");
    if (dl.mode === "FILE") {
      expect(dl.downloadFilename).toBe("Compliance Audit Note.txt");
      expect(dl.mimeType).toBe("text/plain");
    }
  });

  it("should permit authenticated investor download notice when local binary absent", async () => {
    mockPrisma.document.findUnique.mockResolvedValueOnce({
      id: "doc_pas4_sample",
      title: "Private Placement Offer Letter (PAS-4)",
      filePath: "storage/documents/nonexistent_in_tmp.pdf",
      mimeType: "application/pdf",
      isPublic: false,
      status: "APPROVED",
    });

    const outcome = await service.downloadDocument("doc_pas4_sample", investor);
    expect(outcome.mode).toBe("NOTICE");
    if (outcome.mode === "NOTICE") {
      expect(outcome.payload.status).toBe("APPROVED_PENDING_COUNSEL_WATERMARK");
      expect(outcome.payload.storageDriver).toBe("LOCAL_FS");
    }
  });
});
