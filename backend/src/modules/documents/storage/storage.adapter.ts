import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "node:fs";
import * as path from "node:path";
import { MAX_DOCUMENT_SIZE_BYTES } from "../dto/document.dto";

export interface StorageReadResult {
  found: boolean;
  buffer?: Buffer;
  resolvedPath?: string;
}

export interface StorageProviderStatus {
  driver: "LOCAL_FS";
  configured: boolean;
  s3EnvConfigured: boolean;
  remoteDriverImplemented: false;
  bucket?: string;
}

export const MIME_EXTENSION_MAP: Record<string, readonly string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "text/plain": [".txt"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

export function getCanonicalExtensionForMime(mimeType: string): string {
  const extensions = MIME_EXTENSION_MAP[mimeType];
  return extensions ? extensions[0] : ".bin";
}

export function sanitizeDownloadFilename(title: string, mimeType: string): string {
  const ext = getCanonicalExtensionForMime(mimeType);
  const cleanedBase = String(title || "document")
    .replace(/[\r\n"\\/:*?<>|]+/g, "_")
    .replace(/\.+$/g, "")
    .trim()
    .slice(0, 120);
  const baseName = cleanedBase || "document";
  const lower = baseName.toLowerCase();
  if (lower.endsWith(ext)) {
    return baseName;
  }
  return `${baseName}${ext}`;
}

export function isBufferValidForMime(buffer: Buffer, mimeType: string): boolean {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0 || buffer.length > MAX_DOCUMENT_SIZE_BYTES) {
    return false;
  }

  switch (mimeType) {
    case "application/pdf":
      return buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "%PDF-";
    case "image/png":
      return (
        buffer.length >= 8 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      );
    case "image/jpeg":
      return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return (
        buffer.length >= 4 &&
        buffer[0] === 0x50 &&
        buffer[1] === 0x4b &&
        buffer[2] === 0x03 &&
        buffer[3] === 0x04
      );
    case "text/plain": {
      if (buffer.includes(0x00)) return false;
      const preview = buffer.subarray(0, 512).toString("utf8").trimStart().toLowerCase();
      if (preview.startsWith("<!doctype html") || preview.startsWith("<html") || preview.startsWith("<svg")) {
        return false;
      }
      return true;
    }
    default:
      return false;
  }
}

/**
 * Storage adapter enforcing strict path traversal prevention, magic-byte validation,
 * and honest local-filesystem driver reporting until S3/R2 SDK integration is completed.
 */
@Injectable()
export class StorageAdapter {
  private readonly localRootDir: string;

  constructor(private readonly configService: ConfigService) {
    const customDir = this.configService.get<string>("STORAGE_ROOT_DIR");
    this.localRootDir = customDir
      ? path.resolve(customDir)
      : path.resolve(process.cwd(), "..", "storage", "documents");
  }

  getProviderStatus(): StorageProviderStatus {
    const bucket = this.configService.get<string>("S3_BUCKET_NAME");
    const accessKey = this.configService.get<string>("S3_ACCESS_KEY_ID");
    const secretKey = this.configService.get<string>("S3_SECRET_ACCESS_KEY");

    return {
      driver: "LOCAL_FS",
      configured: true,
      s3EnvConfigured: Boolean(bucket && accessKey && secretKey),
      remoteDriverImplemented: false,
      ...(bucket ? { bucket } : {}),
    };
  }

  resolveSafeLocalPath(rawFilePath: string): string {
    const normalizedInput = String(rawFilePath || "").replace(/\\/g, "/");
    if (!normalizedInput || normalizedInput.includes("\0") || normalizedInput.includes("..")) {
      throw new BadRequestException("Blocked unsafe document storage path resolution.");
    }

    const stripped = normalizedInput.replace(/^\/+/, "");
    const segments = stripped.split("/").filter(Boolean);
    const relativeKey =
      segments.length >= 3 && segments[0] === "storage" && segments[1] === "documents"
        ? segments.slice(2).join("/")
        : segments[segments.length - 1] || "document";

    const safeFileName = relativeKey.replace(/[^a-zA-Z0-9._/-]/g, "_");
    const resolved = path.resolve(this.localRootDir, safeFileName);
    const rootWithSep = this.localRootDir.endsWith(path.sep)
      ? this.localRootDir
      : `${this.localRootDir}${path.sep}`;

    if (!resolved.startsWith(rootWithSep)) {
      throw new BadRequestException("Blocked unsafe document storage path resolution.");
    }
    return resolved;
  }

  writeLocalDocument(storageKey: string, buffer: Buffer, mimeType: string): string {
    if (this.getProviderStatus().s3EnvConfigured) {
      throw new ServiceUnavailableException(
        "Remote S3/R2 SDK upload driver is not yet integrated in StorageAdapter."
      );
    }
    if (!isBufferValidForMime(buffer, mimeType)) {
      throw new BadRequestException("Uploaded binary signature does not match declared MIME type or size bounds.");
    }

    const resolvedPath = this.resolveSafeLocalPath(storageKey);
    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
    fs.writeFileSync(resolvedPath, buffer);
    return resolvedPath;
  }

  readLocalDocument(rawFilePath: string): StorageReadResult {
    const resolvedPath = this.resolveSafeLocalPath(rawFilePath);
    if (!fs.existsSync(resolvedPath)) {
      return { found: false, resolvedPath };
    }
    return {
      found: true,
      buffer: fs.readFileSync(resolvedPath),
      resolvedPath,
    };
  }
}
