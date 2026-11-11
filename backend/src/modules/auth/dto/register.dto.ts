import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

const INVESTOR_CATEGORIES = ["HNI", "FAMILY_OFFICE", "CORPORATE", "INSTITUTIONAL"] as const;

export class RegisterDto {
  @ApiProperty({ description: "Full legal name of the user", example: "Vikramaditya Sharma" })
  @IsString()
  @IsNotEmpty({ message: "Full name is required." })
  name: string;

  @ApiProperty({ description: "Valid email address", example: "investor@example.com" })
  @IsEmail({}, { message: "A valid email address is required." })
  email: string;

  @ApiProperty({ description: "Password (minimum 8 characters)", example: "Institutional2026!#" })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  password: string;

  @ApiPropertyOptional({ description: "Contact mobile number", example: "+91 98765 00003" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: "Optional investor classification",
    enum: INVESTOR_CATEGORIES,
    example: "HNI",
  })
  @IsOptional()
  @IsIn(INVESTOR_CATEGORIES, { message: "Unsupported investor category selection." })
  investorCategory?: (typeof INVESTOR_CATEGORIES)[number];
}
