import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ProjectCategory, ProjectStage, ProjectStatus } from "@prisma/client";

export class ProjectDocumentMetaDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  size?: number;
}

export class CreateProjectDto {
  @ApiProperty({ description: "Applicant full name", example: "Rajendra Singhania" })
  @IsString()
  @MinLength(2)
  applicantName: string;

  @ApiProperty({ description: "Developer organization name", example: "Singhania Buildcon Pvt. Ltd." })
  @IsString()
  @MinLength(2)
  organizationName: string;

  @ApiProperty({ description: "Business email", example: "rajendra@singhaniabuildcon.example" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Phone number", example: "+91 98765 11223" })
  @IsString()
  @MinLength(8)
  phone: string;

  @ApiProperty({ description: "Applicant role", example: "Managing Director" })
  @IsString()
  @MinLength(2)
  role: string;

  @ApiPropertyOptional({ description: "Company website", example: "https://singhaniabuildcon.example" })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: "Project name", example: "Green Crest Meadows & Towers" })
  @IsString()
  @MinLength(2)
  projectName: string;

  @ApiProperty({ enum: ProjectCategory, description: "Project category", example: "RESIDENTIAL" })
  @IsEnum(ProjectCategory, { message: "Invalid project category." })
  category: ProjectCategory;

  @ApiProperty({ description: "Address", example: "Plot 45, Sector 12" })
  @IsString()
  @MinLength(5)
  address: string;

  @ApiProperty({ description: "City", example: "Indore" })
  @IsString()
  @MinLength(2)
  city: string;

  @ApiProperty({ description: "State", example: "Madhya Pradesh" })
  @IsString()
  @MinLength(2)
  state: string;

  @ApiProperty({ description: "PIN Code (6 digits)", example: "452010" })
  @IsString()
  @Matches(/^\d{6}$/, { message: "A valid 6-digit postal PIN code is required." })
  pinCode: string;

  @ApiProperty({ description: "Land status", example: "Freehold (100% Owned)" })
  @IsString()
  @MinLength(2)
  landStatus: string;

  @ApiProperty({ enum: ProjectStage, description: "Development stage", example: "UNDER_CONSTRUCTION" })
  @IsEnum(ProjectStage, { message: "Invalid project stage." })
  stage: ProjectStage;

  @ApiProperty({ description: "Detailed description", example: "Multi-tower residential project with RERA clearance." })
  @IsString()
  @MinLength(20)
  description: string;

  @ApiProperty({ description: "Total project cost in INR Lakhs / INR", example: 4500 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  totalCost: number;

  @ApiProperty({ description: "Funding requested", example: 1200 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  fundingRequested: number;

  @ApiPropertyOptional({ description: "Promoter contribution", example: 1800 })
  @IsOptional()
  @Transform(({ value }) => (value === "" || value === null || value === undefined ? undefined : Number(value)))
  @IsNumber()
  @Min(0)
  promoterContribution?: number;

  @ApiProperty({ description: "Use of funds", example: "Accelerating construction" })
  @IsString()
  @MinLength(5)
  useOfFunds: string;

  @ApiProperty({ description: "Expected timeline", example: "24 Months" })
  @IsString()
  @MinLength(2)
  expectedTimeline: string;

  @ApiPropertyOptional({ description: "Existing loans", example: "₹8 Cr term loan" })
  @IsOptional()
  @IsString()
  existingLoans?: string;

  @ApiPropertyOptional({ description: "Documents metadata array", type: [ProjectDocumentMetaDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDocumentMetaDto)
  documents?: ProjectDocumentMetaDto[];

  @ApiPropertyOptional({ description: "DPDP Act processing consent", example: true })
  @IsOptional()
  @IsBoolean()
  consentGiven?: boolean;

  @ApiPropertyOptional({ description: "Fiduciary accuracy declaration confirmation", example: true })
  @IsOptional()
  @IsBoolean()
  declarationConfirmed?: boolean;

  @ApiPropertyOptional({ description: "Honeypot field for spam prevention" })
  @IsOptional()
  @IsString()
  website_hp?: string;
}

export class UpdateProjectStatusDto {
  @ApiPropertyOptional({ enum: ProjectStatus, description: "New project status" })
  @IsOptional()
  @IsEnum(ProjectStatus, { message: "Invalid project status." })
  status?: ProjectStatus;

  @ApiPropertyOptional({ description: "Internal confidential notes" })
  @IsOptional()
  @IsString()
  internalNotes?: string;

  @ApiPropertyOptional({ description: "Decline reason if rejected" })
  @IsOptional()
  @IsString()
  declineReason?: string;

  @ApiPropertyOptional({ description: "Information requested from developer" })
  @IsOptional()
  @IsString()
  infoRequested?: string;

  @ApiPropertyOptional({ description: "Audit trail change note" })
  @IsOptional()
  @IsString()
  changeNote?: string;
}
