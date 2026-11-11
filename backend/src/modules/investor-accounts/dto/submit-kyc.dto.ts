import { IsBoolean, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { KycStatus } from "@prisma/client";

const KYC_ID_TYPES = ["PAN", "AADHAAR", "PASSPORT", "VOTER_ID"] as const;

export class SubmitKycDto {
  @ApiProperty({ description: "Indian Permanent Account Number (PAN)", example: "ABCDE1234F" })
  @IsString()
  @Matches(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/, {
    message: "Invalid PAN format. Standard format is 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).",
  })
  panNumber: string;

  @ApiProperty({ description: "Identity document type", enum: KYC_ID_TYPES, example: "PAN" })
  @IsIn(KYC_ID_TYPES, { message: "Unsupported identity document type." })
  idType: (typeof KYC_ID_TYPES)[number];

  @ApiProperty({ description: "Document ID number", example: "ABCDE1234F" })
  @IsString()
  @IsNotEmpty({ message: "Identity document number is required." })
  idNumber: string;

  @ApiProperty({ description: "DPDP Act processing consent", example: true })
  @IsBoolean()
  consent: boolean;
}

export class UpdateKycStatusDto {
  @ApiProperty({ description: "Target User ID" })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: KycStatus, description: "New verification status" })
  @IsEnum(KycStatus, { message: "Invalid KYC status." })
  status: KycStatus;

  @ApiPropertyOptional({ description: "Rejection explanation if rejected" })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
