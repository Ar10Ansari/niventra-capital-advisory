import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

const INVESTOR_CATEGORIES = ["HNI", "FAMILY_OFFICE", "CORPORATE", "INSTITUTIONAL", ""] as const;

export class UpdateProfileDto {
  @ApiProperty({ description: "Full legal name", example: "Vikramaditya Sharma" })
  @IsString()
  @MinLength(2, { message: "Legal full name is required (min 2 characters)." })
  name: string;

  @ApiPropertyOptional({ description: "Contact mobile number", example: "+91 98765 00003" })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @ApiPropertyOptional({
    description: "Optional investor classification category",
    enum: INVESTOR_CATEGORIES,
    example: "HNI",
  })
  @IsOptional()
  @IsIn(INVESTOR_CATEGORIES, { message: "Unsupported investor category selection." })
  investorCategory?: string | null;
}

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ description: "Consultation & scheduling email alerts", example: true })
  @IsOptional()
  @IsBoolean()
  notifyConsultations?: boolean;

  @ApiPropertyOptional({ description: "Regulatory & Form PAS-4 disclosure alerts", example: true })
  @IsOptional()
  @IsBoolean()
  notifyDisclosures?: boolean;

  @ApiPropertyOptional({ description: "Grievance SLA status alerts", example: true })
  @IsOptional()
  @IsBoolean()
  notifyGrievances?: boolean;
}

export class ChangePasswordDto {
  @ApiProperty({ description: "Current password", example: "OldPassword2026!" })
  @IsString()
  @IsNotEmpty({ message: "Current password is required." })
  currentPassword: string;

  @ApiProperty({ description: "New secure password (min 8 chars)", example: "NewSecurePassword2026!#" })
  @IsString()
  @MinLength(8, { message: "New password must be at least 8 characters long." })
  newPassword: string;
}

export class DeletionRequestDto {
  @ApiPropertyOptional({ description: "Legal full name", example: "Vikramaditya Sharma" })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: "Registered email address", example: "investor@example.com" })
  @IsOptional()
  @IsEmail({}, { message: "A valid email address is required." })
  email?: string;

  @ApiPropertyOptional({ description: "Phone number", example: "+91 98765 00003" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: "Reason for account deletion" })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ description: "Password verification if logged in" })
  @IsOptional()
  @IsString()
  password?: string;
}
