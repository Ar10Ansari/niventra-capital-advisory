import { parseDecimalToPaise, paiseToInrNumber, summarizeActiveInvestments } from "./money";

describe("Financial Fixed-Point Paise Utilities", () => {
  it("avoids binary IEEE-754 floating-point drift on decimal INR additions", () => {
    const sum =
      parseDecimalToPaise("0.10") +
      parseDecimalToPaise("0.20") +
      parseDecimalToPaise("1000000.35");

    expect(sum).toBe(100000065n);
    expect(paiseToInrNumber(sum)).toBe(1000000.65);
  });

  it("summarizes only ACTIVE investments with exact paise arithmetic and earliest payout date", () => {
    const summary = summarizeActiveInvestments([
      {
        status: "ACTIVE",
        principalAmount: "1500000.10",
        accruedInterest: "100.10",
        interestPaid: "40.05",
        pendingInterest: "60.05",
        nextPayoutDate: new Date("2026-11-15T00:00:00.000Z"),
      },
      {
        status: "ACTIVE",
        principalAmount: "2500000.20",
        accruedInterest: "200.20",
        interestPaid: "100.15",
        pendingInterest: "100.05",
        nextPayoutDate: new Date("2026-10-15T00:00:00.000Z"),
      },
      {
        status: "MATURED",
        principalAmount: "9999999.99",
        accruedInterest: "50000.00",
        interestPaid: "50000.00",
        pendingInterest: "0.00",
        nextPayoutDate: new Date("2025-01-01T00:00:00.000Z"),
      },
    ]);

    expect(summary).toEqual({
      totalPrincipal: 4000000.3,
      activeCount: 2,
      accruedInterest: 300.3,
      interestPaid: 140.2,
      pendingInterest: 160.1,
      nextPayoutDate: "2026-10-15",
      currency: "INR",
    });
  });
});

