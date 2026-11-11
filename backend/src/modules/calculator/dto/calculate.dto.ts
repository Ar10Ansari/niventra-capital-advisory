import { IsIn, IsNumber, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CalculateDto {
  @ApiProperty({ description: "Investment principal in INR", example: 1000000, minimum: 100000, maximum: 100000000 })
  @IsNumber()
  @Min(100000)
  @Max(100000000)
  principal: number;

  @ApiProperty({ description: "Indicative annual coupon yield percentage", example: 14.0, minimum: 8.0, maximum: 24.0 })
  @IsNumber()
  @Min(8.0)
  @Max(24.0)
  annualRatePct: number;

  @ApiProperty({ description: "Tenor in months", example: 36, minimum: 6, maximum: 120 })
  @IsNumber()
  @Min(6)
  @Max(120)
  tenorMonths: number;

  @ApiProperty({
    enum: ["MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL", "CUMULATIVE"],
    description: "Coupon distribution payout frequency",
    example: "QUARTERLY",
  })
  @IsIn(["MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL", "CUMULATIVE"])
  payoutFrequency: "MONTHLY" | "QUARTERLY" | "SEMI_ANNUAL" | "ANNUAL" | "CUMULATIVE";
}
