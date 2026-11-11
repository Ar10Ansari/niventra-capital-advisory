export interface InvestmentMetricRow {
  status: string;
  principalAmount: unknown;
  accruedInterest: unknown;
  interestPaid: unknown;
  pendingInterest: unknown;
  nextPayoutDate?: Date | null;
}

export interface PortfolioSummaryResult {
  totalPrincipal: number;
  activeCount: number;
  accruedInterest: number;
  interestPaid: number;
  pendingInterest: number;
  nextPayoutDate: string | null;
  currency: "INR";
}

/**
 * Parses a numeric/Decimal value into exact integer paise (1 INR = 100 paise)
 * using base-10 string parsing to avoid IEEE-754 binary floating-point drift
 * when summing currency figures across holdings.
 */
export function parseDecimalToPaise(value: unknown): bigint {
  if (value === null || value === undefined || value === "") {
    return 0n;
  }

  const raw = String(value).trim().replace(/,/g, "");
  if (!raw) {
    return 0n;
  }

  const match = raw.match(/^([+-])?(\d+)(?:\.(\d+))?$/);
  if (!match) {
    const fallbackNum = Number(raw);
    if (!Number.isFinite(fallbackNum)) {
      return 0n;
    }
    return BigInt(Math.round(fallbackNum * 100));
  }

  const isNegative = match[1] === "-";
  const wholePart = BigInt(match[2]);
  const fracRaw = (match[3] || "").padEnd(3, "0");
  const twoDigits = BigInt(fracRaw.slice(0, 2));
  const roundDigit = Number(fracRaw[2]);

  let paise = wholePart * 100n + twoDigits;
  if (roundDigit >= 5) {
    paise += 1n;
  }

  return isNegative ? -paise : paise;
}

export function paiseToInrNumber(paise: bigint): number {
  const isNegative = paise < 0n;
  const abs = isNegative ? -paise : paise;
  const whole = abs / 100n;
  const fraction = (abs % 100n).toString().padStart(2, "0");
  return Number(`${isNegative ? "-" : ""}${whole}.${fraction}`);
}

export function summarizeActiveInvestments(
  rows: ReadonlyArray<InvestmentMetricRow>
): PortfolioSummaryResult {
  let activeCount = 0;
  let totalPrincipalPaise = 0n;
  let accruedPaise = 0n;
  let paidPaise = 0n;
  let pendingPaise = 0n;
  let nextPayoutDate: string | null = null;

  for (const inv of rows) {
    if (inv.status !== "ACTIVE") {
      continue;
    }

    activeCount += 1;
    totalPrincipalPaise += parseDecimalToPaise(inv.principalAmount);
    accruedPaise += parseDecimalToPaise(inv.accruedInterest);
    paidPaise += parseDecimalToPaise(inv.interestPaid);
    pendingPaise += parseDecimalToPaise(inv.pendingInterest);

    if (inv.nextPayoutDate) {
      const dateStr = inv.nextPayoutDate.toISOString().slice(0, 10);
      if (!nextPayoutDate || dateStr < nextPayoutDate) {
        nextPayoutDate = dateStr;
      }
    }
  }

  return {
    totalPrincipal: paiseToInrNumber(totalPrincipalPaise),
    activeCount,
    accruedInterest: paiseToInrNumber(accruedPaise),
    interestPaid: paiseToInrNumber(paidPaise),
    pendingInterest: paiseToInrNumber(pendingPaise),
    nextPayoutDate,
    currency: "INR",
  };
}

