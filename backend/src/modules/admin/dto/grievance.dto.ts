import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, IsEmail } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

const GRIEVANCE_STATUSES = [
  "SUBMITTED",
  "ACKNOWLEDGED",
  "UNDER_INVESTIGATION",
  "RESOLVED",
  "ESCALATED",
] as const;

export class CreateGrievanceDto {
  @ApiProperty({ description: "Complainant full legal name", example: "Rahul Verma" })
  @IsString()
  @IsNotEmpty({ message: "Complainant name is required." })
  complainantName: string;

  @ApiProperty({ description: "Contact email", example: "rahul.verma@example.com" })
  @IsEmail({}, { message: "Valid email address is required." })
  email: string;

  @ApiProperty({ description: "Contact mobile phone", example: "+91 98765 99887" })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ description: "Optional investment or transaction reference", example: "TXN-2026-0914" })
  @IsOptional()
  @IsString()
  transactionRef?: string;

  @ApiProperty({ description: "Subject of formal grievance" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  subject: string;

  @ApiProperty({ description: "Detailed factual summary" })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateGrievanceDto {
  @ApiPropertyOptional({ enum: GRIEVANCE_STATUSES, example: "ACKNOWLEDGED" })
  @IsOptional()
  @IsIn(GRIEVANCE_STATUSES, { message: "Invalid grievance status." })
  status?: (typeof GRIEVANCE_STATUSES)[number];

  @ApiPropertyOptional({ description: "Staff or Grievance Officer user ID" })
  @IsOptional()
  @IsString()
  assignedTo?: string | null;

  @ApiPropertyOptional({ description: "Formal investigation or resolution notes" })
  @IsOptional()
  @IsString()
  resolutionNotes?: string;

  @ApiPropertyOptional({ description: "Alias for resolutionNotes (backward compatible)" })
  @IsOptional()
  @IsString()
  notes?: string;
}
