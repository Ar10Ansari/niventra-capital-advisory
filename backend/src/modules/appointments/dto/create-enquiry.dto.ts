import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

const ENQUIRY_STATUSES = [
  "NEW",
  "IN_REVIEW",
  "CONTACTED",
  "QUALIFIED",
  "FOLLOW_UP",
  "CONVERTED",
  "CLOSED",
] as const;

export class CreateEnquiryDto {
  @ApiProperty({ description: "Full legal name", example: "Vikramaditya Sharma" })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({ description: "Contact email", example: "investor@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Phone number", example: "+91 98765 00003" })
  @IsString()
  @MinLength(8)
  phoneNumber: string;

  @ApiPropertyOptional({ description: "Category", example: "Capital Provider / Investor" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: "Capital Range", example: "₹25 Lakh – ₹1 Crore" })
  @IsOptional()
  @IsString()
  capitalRange?: string;

  @ApiPropertyOptional({ description: "Message or consultation specifics" })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ description: "DPDP Act 2023 processing consent", example: true })
  @IsOptional()
  @IsBoolean()
  consent?: boolean;

  @ApiPropertyOptional({ description: "Honeypot protection field" })
  @IsOptional()
  @IsString()
  website_hp?: string;
}

export class UpdateEnquiryDto {
  @ApiPropertyOptional({ enum: ENQUIRY_STATUSES, example: "CONTACTED" })
  @IsOptional()
  @IsIn(ENQUIRY_STATUSES, { message: "Invalid enquiry status." })
  status?: (typeof ENQUIRY_STATUSES)[number];

  @ApiPropertyOptional({ description: "Staff user ID assigned to this enquiry" })
  @IsOptional()
  @IsString()
  assignedTo?: string | null;

  @ApiPropertyOptional({ description: "Private CRM desk notes" })
  @IsOptional()
  @IsString()
  internalNotes?: string;
}
