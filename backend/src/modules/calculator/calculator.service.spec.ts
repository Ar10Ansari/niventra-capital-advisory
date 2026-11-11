import { CalculatorService } from "./calculator.service";

describe("CalculatorService", () => {
  let service: CalculatorService;

  beforeEach(() => {
    service = new CalculatorService();
  });

  it("should calculate simple interest correctly (Principal: 10L, Rate: 14%, Tenor: 36m)", () => {
    const result = service.calculate({
      principal: 1000000,
      annualRatePct: 14.0,
      tenorMonths: 36,
      payoutFrequency: "QUARTERLY",
    });

    expect(result.totalGrossInterest).toBe(420000);
    expect(result.totalMaturityAmount).toBe(1420000);
    expect(result.numberOfPayouts).toBe(12);
    expect(result.periodicPayout).toBe(35000);
    expect(result.schedule.length).toBe(12);
    expect(result.tdsCaveat).toContain("Tax Deducted at Source (TDS)");
    expect(result.statutoryDisclaimer).toContain("12%–16% p.a.");
  });

  it("should handle cumulative maturity correctly", () => {
    const result = service.calculate({
      principal: 2500000,
      annualRatePct: 15.0,
      tenorMonths: 24,
      payoutFrequency: "CUMULATIVE",
    });

    expect(result.totalGrossInterest).toBe(750000);
    expect(result.totalMaturityAmount).toBe(3250000);
    expect(result.periodicPayout).toBeNull();
    expect(result.schedule.length).toBe(0);
  });

  it("should reconcile final monthly payout rounding residual exactly to totalGrossInterest", () => {
    // 1,00,000 * 14.5% * 1yr = 14,500; 14,500 / 12 = 1208.33 -> 11*1208 + last = 14,500
    const result = service.calculate({
      principal: 100000,
      annualRatePct: 14.5,
      tenorMonths: 12,
      payoutFrequency: "MONTHLY",
    });

    const sumOfSchedule = result.schedule.reduce((acc, item) => acc + item.payoutAmount, 0);
    expect(sumOfSchedule).toBe(result.totalGrossInterest);
    expect(result.schedule[11].cumulativeInterest).toBe(result.totalGrossInterest);
    expect(result.schedule.every((entry) => entry.remainingPrincipal === 100000)).toBe(true);
  });
});
