/**
 * Niventra Capital Advisory — Indicative Return Calculation Engine
 *
 * Fiduciary Guidelines & Architectural Principles:
 * 1. Simple Interest Standard: Debentures and fixed-income instruments operate on
 *    simple-interest coupon distributions, NEVER equity SIP compounding.
 * 2. Strict Boundary Validation: Guard against negative values, non-numeric strings,
 *    zero, and absurd ranges.
 * 3. Indicative Yield Compliance: Default within the company-approved 12%–16% p.a. range.
 * 4. Statutory TDS Caveat: Prominently disclose Tax Deducted at Source under Section 193/194A
 *    of the Indian Income Tax Act, 1961.
 * 5. Non-Guaranteed Disclaimer: Indicative arithmetic models only. Not a binding financial commitment.
 */

export type PayoutFrequency =
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMI_ANNUAL"
  | "ANNUAL"
  | "CUMULATIVE";

export interface CalculatorInput {
  principal: number;
  annualRatePct: number;
  tenorMonths: number;
  payoutFrequency: PayoutFrequency;
}

export interface PeriodicPayoutDetail {
  periodNumber: number;
  periodLabel: string;
  payoutAmount: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface CalculatorResult {
  principal: number;
  annualRatePct: number;
  tenorMonths: number;
  payoutFrequency: PayoutFrequency;
  totalGrossInterest: number;
  totalMaturityAmount: number;
  periodicPayout: number | null;
  numberOfPayouts: number;
  payoutFrequencyLabel: string;
  schedule: PeriodicPayoutDetail[];
  tdsCaveat: string;
  statutoryDisclaimer: string;
  isValid: boolean;
  validationError?: string;
}

export const CALCULATOR_BOUNDS = {
  MIN_PRINCIPAL: 100_000,        // ₹1 Lakh minimum
  MAX_PRINCIPAL: 100_000_000,   // ₹10 Crore maximum
  DEFAULT_PRINCIPAL: 1_000_000, // ₹10 Lakh default
  MIN_RATE: 8.0,                // 8% p.a.
  MAX_RATE: 24.0,               // 24% p.a.
  DEFAULT_RATE: 14.0,           // 14% p.a. (within approved 12%–16% guidance)
  MIN_TENOR_MONTHS: 6,
  MAX_TENOR_MONTHS: 120,        // 10 years
  DEFAULT_TENOR_MONTHS: 36,     // 3 years
};

export const PAYOUT_FREQUENCY_LABELS: Record<PayoutFrequency, string> = {
  MONTHLY: "Monthly Distribution (12/year)",
  QUARTERLY: "Quarterly Distribution (4/year)",
  SEMI_ANNUAL: "Semi-Annual Distribution (2/year)",
  ANNUAL: "Annual Distribution (1/year)",
  CUMULATIVE: "Cumulative at Maturity",
};

export const TDS_STATUTORY_CAVEAT =
  "Tax Deducted at Source (TDS) under Section 193 / 194A of the Indian Income Tax Act, 1961 is applicable on debenture coupon distributions (standard rate 10% for resident individual investors presenting PAN, subject to applicable Form 15G / 15H declarations). Figures presented are gross indicative distributions before statutory withholding.";

export const STATUTORY_FIDUCIARY_DISCLAIMER =
  "This calculation engine provides illustrative mathematical models based on standard simple-interest conventions. It does not constitute an offer, solicitation, or guaranteed investment return. Specific debenture coupon rates (approved indicative guidance: 12%–16% p.a.*), repayment schedules, and security covenants are governed exclusively by executed Debenture Trust Deeds and private placement memorandums (Form PAS-4).";

/**
 * Validates calculator inputs and returns a descriptive error message if invalid.
 */
export function validateCalculatorInput(input: Partial<CalculatorInput>): { isValid: boolean; error?: string } {
  const principal = Number(input.principal);
  const rate = Number(input.annualRatePct);
  const tenor = Number(input.tenorMonths);

  if (isNaN(principal) || principal < CALCULATOR_BOUNDS.MIN_PRINCIPAL || principal > CALCULATOR_BOUNDS.MAX_PRINCIPAL) {
    return {
      isValid: false,
      error: `Principal must be between ₹${CALCULATOR_BOUNDS.MIN_PRINCIPAL.toLocaleString("en-IN")} and ₹${(CALCULATOR_BOUNDS.MAX_PRINCIPAL / 10_000_000).toFixed(0)} Crore.`,
    };
  }

  if (isNaN(rate) || rate < CALCULATOR_BOUNDS.MIN_RATE || rate > CALCULATOR_BOUNDS.MAX_RATE) {
    return {
      isValid: false,
      error: `Annual indicative rate must be between ${CALCULATOR_BOUNDS.MIN_RATE}% and ${CALCULATOR_BOUNDS.MAX_RATE}% p.a.`,
    };
  }

  if (isNaN(tenor) || tenor < CALCULATOR_BOUNDS.MIN_TENOR_MONTHS || tenor > CALCULATOR_BOUNDS.MAX_TENOR_MONTHS) {
    return {
      isValid: false,
      error: `Tenor must be between ${CALCULATOR_BOUNDS.MIN_TENOR_MONTHS} and ${CALCULATOR_BOUNDS.MAX_TENOR_MONTHS} months.`,
    };
  }

  const validFrequencies: PayoutFrequency[] = ["MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL", "CUMULATIVE"];
  if (!input.payoutFrequency || !validFrequencies.includes(input.payoutFrequency)) {
    return {
      isValid: false,
      error: "Valid payout frequency selection is required.",
    };
  }

  return { isValid: true };
}

/**
 * Calculates indicative simple-interest return schedule for fixed-income debentures.
 */
export function calculateIndicativeReturn(input: CalculatorInput): CalculatorResult {
  const validation = validateCalculatorInput(input);

  const safePrincipal = Math.max(
    CALCULATOR_BOUNDS.MIN_PRINCIPAL,
    Math.min(CALCULATOR_BOUNDS.MAX_PRINCIPAL, Number(input.principal) || CALCULATOR_BOUNDS.DEFAULT_PRINCIPAL)
  );
  const safeRate = Math.max(
    CALCULATOR_BOUNDS.MIN_RATE,
    Math.min(CALCULATOR_BOUNDS.MAX_RATE, Number(input.annualRatePct) || CALCULATOR_BOUNDS.DEFAULT_RATE)
  );
  const safeTenor = Math.max(
    CALCULATOR_BOUNDS.MIN_TENOR_MONTHS,
    Math.min(CALCULATOR_BOUNDS.MAX_TENOR_MONTHS, Math.round(Number(input.tenorMonths) || CALCULATOR_BOUNDS.DEFAULT_TENOR_MONTHS))
  );
  const frequency = input.payoutFrequency || "QUARTERLY";

  // Standard Simple Interest Formula:
  // Total Interest = Principal * (Annual Rate / 100) * (Tenor Months / 12)
  const tenorYears = safeTenor / 12;
  const rawInterest = safePrincipal * (safeRate / 100) * tenorYears;
  const totalGrossInterest = Math.round(rawInterest);
  const totalMaturityAmount = safePrincipal + totalGrossInterest;

  let periodicPayout: number | null = null;
  let numberOfPayouts = 0;
  const schedule: PeriodicPayoutDetail[] = [];

  if (frequency === "CUMULATIVE") {
    periodicPayout = null;
    numberOfPayouts = 0;
  } else {
    const periodsPerYearMap: Record<Exclude<PayoutFrequency, "CUMULATIVE">, number> = {
      MONTHLY: 12,
      QUARTERLY: 4,
      SEMI_ANNUAL: 2,
      ANNUAL: 1,
    };
    const periodsPerYear = periodsPerYearMap[frequency];
    numberOfPayouts = Math.max(1, Math.round(tenorYears * periodsPerYear));
    periodicPayout = Math.round(totalGrossInterest / numberOfPayouts);

    let runningInterest = 0;
    for (let i = 1; i <= numberOfPayouts; i++) {
      // In last period, account for any rounding difference
      const amount = i === numberOfPayouts ? totalGrossInterest - runningInterest : periodicPayout;
      runningInterest += amount;

      let label = `Period ${i}`;
      if (frequency === "MONTHLY") label = `Month ${i}`;
      else if (frequency === "QUARTERLY") label = `Quarter ${i} (Month ${i * 3})`;
      else if (frequency === "SEMI_ANNUAL") label = `Half-Year ${i} (Month ${i * 6})`;
      else if (frequency === "ANNUAL") label = `Year ${i}`;

      schedule.push({
        periodNumber: i,
        periodLabel: label,
        payoutAmount: amount,
        cumulativeInterest: runningInterest,
        remainingPrincipal: safePrincipal,
      });
    }
  }

  return {
    principal: safePrincipal,
    annualRatePct: safeRate,
    tenorMonths: safeTenor,
    payoutFrequency: frequency,
    totalGrossInterest,
    totalMaturityAmount,
    periodicPayout,
    numberOfPayouts,
    payoutFrequencyLabel: PAYOUT_FREQUENCY_LABELS[frequency],
    schedule,
    tdsCaveat: TDS_STATUTORY_CAVEAT,
    statutoryDisclaimer: STATUTORY_FIDUCIARY_DISCLAIMER,
    isValid: validation.isValid,
    validationError: validation.error,
  };
}

/**
 * Currency formatter for Indian numbering system (Lakhs & Crores)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
