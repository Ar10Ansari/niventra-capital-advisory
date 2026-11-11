import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

const PRODUCT_CATEGORIES = ["DEBENTURE", "REAL_ESTATE_DEBT", "STRUCTURED_FINANCE"] as const;

export class CreateProductDto {
  @ApiProperty({ description: "URL slug", example: "secured-ncd-tranche-b" })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: "Product display title", example: "Secured Real Estate Debenture Tranche B" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ enum: PRODUCT_CATEGORIES, example: "DEBENTURE" })
  @IsOptional()
  @IsIn(PRODUCT_CATEGORIES)
  category?: (typeof PRODUCT_CATEGORIES)[number];

  @ApiProperty({ description: "Indicative annual yield guidance", example: "14.25% p.a.*" })
  @IsString()
  @IsNotEmpty()
  indicativeYield: string;

  @ApiProperty({ description: "Tenor description", example: "36 Months" })
  @IsString()
  @IsNotEmpty()
  tenor: string;

  @ApiPropertyOptional({ description: "Minimum allocation amount", example: "₹10,00,000" })
  @IsOptional()
  @IsString()
  minInvestment?: string;

  @ApiPropertyOptional({ description: "Collateral and trustee security summary" })
  @IsOptional()
  @IsString()
  securityType?: string;

  @ApiPropertyOptional({ description: "Executive summary" })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ description: "Detailed structure description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: "Key risks & statutory disclosure summary" })
  @IsOptional()
  @IsString()
  risksSummary?: string;
}
