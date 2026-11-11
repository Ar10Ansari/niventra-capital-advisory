import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

export const DOCUMENT_TYPES = [
  "OFFER_DOC",
  "TERM_SHEET",
  "COMPLIANCE",
  "POLICY",
  "DUE_DILIGENCE",
] as const;

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "image/png",
  "image/jpeg",
] as const;

export const DOCUMENT_STATUSES = ["PENDING", "APPROVED", "ARCHIVED"] as const;

export const MAX_DOCUMENT_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export type AllowedDocumentMimeType = (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number];

export class CreateDocumentDto {
  @ApiProperty({ description: "Document display title", example: "Debenture Information Memorandum (Form PAS-4)" })
  @IsString()
  @IsNotEmpty({ message: "Document title and type are required." })
  @MaxLength(255)
  title: string;

  @ApiProperty({ enum: DOCUMENT_TYPES, example: "OFFER_DOC" })
  @IsIn(DOCUMENT_TYPES, { message: "Unsupported document type." })
  docType: (typeof DOCUMENT_TYPES)[number];

  @ApiPropertyOptional({ description: "Storage object key relative to safe documents root" })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  @Matches(/^[a-zA-Z0-9._/-]+$/, {
    message: "Storage file path may only contain safe alphanumeric, '.', '_', '-', and '/' characters.",
  })
  filePath?: string;

  @ApiPropertyOptional({ description: "File size in bytes (max 15 MB)", example: 412000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_DOCUMENT_SIZE_BYTES, {
    message: `File size must not exceed ${MAX_DOCUMENT_SIZE_BYTES} bytes (15 MB).`,
  })
  fileSize?: number;

  @ApiPropertyOptional({
    enum: ALLOWED_DOCUMENT_MIME_TYPES,
    description: "Validated MIME content type",
    example: "application/pdf",
  })
  @IsOptional()
  @IsIn(ALLOWED_DOCUMENT_MIME_TYPES, {
    message: "Unsupported MIME type. Only PDF, DOCX, XLSX, TXT, PNG, and JPEG are permitted.",
  })
  mimeType?: AllowedDocumentMimeType;

  @ApiPropertyOptional({ description: "Semantic document version", example: "1.0" })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  version?: string;

  @ApiPropertyOptional({ description: "Whether unauthenticated visitors may view/download", example: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true") return true;
      if (normalized === "false") return false;
    }
    return value;
  })
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ enum: DOCUMENT_STATUSES, default: "APPROVED" })
  @IsOptional()
  @IsIn(DOCUMENT_STATUSES, { message: "Unsupported document approval status." })
  status?: (typeof DOCUMENT_STATUSES)[number];

  @ApiPropertyOptional({ description: "Optional user ID binding document ownership to one investor" })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{3,128}$/, { message: "Invalid ownerId format." })
  ownerId?: string;
}
