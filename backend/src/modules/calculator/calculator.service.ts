import { Injectable } from "@nestjs/common";
import { CalculateDto } from "./dto/calculate.dto";

export interface ScheduleEntry {
  periodNumber: number;
  periodLabel: string;
  payoutAmount: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

@Injectable()
export class CalculatorService {
  private readonly TDS_STATUTORY_CAVEAT =
    "Tax Deducted at Source (TDS) under Section 193 / 194A of the Indian Income Tax Act, 1961 is applicable on debenture coupon distributions (standard rate 10% for resident individual investors presenting PAN, subject to applicable Form 15G / 15H declarations). Figures presented are gross indicative distributions before statutory withholding.";

  private readonly STATUTORY_FIDUCIARY_DISCLAIMER =
    "This calculation engine provides illustrative mathematical models based on standard simple-interest conventions. It does not constitute an offer, solicitation, or guaranteed investment return. Specific debenture coupon rates (approved indicative guidance: 12%–16% p.a.*), repayment schedules, and security covenants are governed exclusively by executed Debenture Trust Deeds and private placement memorandums (Form PAS-4).";

  calculate(dto: CalculateDto) {
    const tenorYears = dto.tenorMonths / 12;
    const rawInterest = dto.principal * (dto.annualRatePct / 100) * tenorYears;
    const totalGrossInterest = Math.round(rawInterest);
    const totalMaturityAmount = dto.principal + totalGrossInterest;

    let periodicPayout: number | null = null;
    let numberOfPayouts = 0;
    const schedule: ScheduleEntry[] = [];

    if (dto.payoutFrequency !== "CUMULATIVE") {
      const freqMap: Record<Exclude<CalculateDto["payoutFrequency"], "CUMULATIVE">, number> = {
        MONTHLY: 12,
        QUARTERLY: 4,
        SEMI_ANNUAL: 2,
        ANNUAL: 1,
      };
      const periodsPerYear = freqMap[dto.payoutFrequency];
      numberOfPayouts = Math.max(1, Math.round(tenorYears * periodsPerYear));
      periodicPayout = Math.round(totalGrossInterest / numberOfPayouts);

      let runningInterest = 0;
      for (let i = 1; i <= numberOfPayouts; i++) {
        const amount =
          i === numberOfPayouts ? totalGrossInterest - runningInterest : periodicPayout;
        runningInterest += amount;

        schedule.push({
          periodNumber: i,
          periodLabel: `Period ${i}`,
          payoutAmount: amount,
          cumulativeInterest: runningInterest,
          remainingPrincipal: dto.principal,
        });
      }
    }

    return {
      principal: dto.principal,
      annualRatePct: dto.annualRatePct,
      tenorMonths: dto.tenorMonths,
      payoutFrequency: dto.payoutFrequency,
      totalGrossInterest,
      totalMaturityAmount,
      periodicPayout,
      numberOfPayouts,
      schedule,
      tdsCaveat: this.TDS_STATUTORY_CAVEAT,
      statutoryDisclaimer: this.STATUTORY_FIDUCIARY_DISCLAIMER,
      isValid: true,
    };
  }
}
