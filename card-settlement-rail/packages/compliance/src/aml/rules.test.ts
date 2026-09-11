import { describe, expect, it } from "vitest";
import { scoreAml } from "./rules.js";

const now = new Date("2026-09-10T12:00:00.000Z");
const tx = (id: string, amountMinor: bigint, timestamp = now, customerId = "cust-1") => ({
  id, customerId, amountMinor, currency: "USD", timestamp,
});

describe("AML rules", () => {
  it("flags more than five transactions in an hour", () => {
    const recent = Array.from({ length: 5 }, (_, i) => tx(`v-${i}`, 10_000n, new Date(now.getTime() - i * 5 * 60_000)));
    const result = scoreAml(tx("current", 10_000n), recent, { customerId: "cust-1" });
    expect(result.rules).toContain("VELOCITY_GT_5_TXNS_PER_HOUR");
    expect(result.risk).toBe("high");
  });

  it("flags transactions just under 10,000 dollars", () => {
    const result = scoreAml(tx("structuring", 999_999n), [], { customerId: "cust-1" });
    expect(result.rules).toContain("STRUCTURING_JUST_UNDER_10K");
  });

  it("does not flag exactly 10,000 dollars as just-under structuring", () => {
    const result = scoreAml(tx("threshold", 1_000_000n), [], { customerId: "cust-1" });
    expect(result.rules).not.toContain("STRUCTURING_JUST_UNDER_10K");
  });

  it("flags configured high-risk geography", () => {
    const result = scoreAml({ ...tx("geo", 50_000n), country: "IR" }, [], { customerId: "cust-1" });
    expect(result.rules).toContain("HIGH_RISK_GEO");
    expect(result.risk).toBe("high");
  });

  it("flags PEP and raises the assessment to critical", () => {
    const result = scoreAml(tx("pep", 50_000n), [], { customerId: "cust-1", isPep: true });
    expect(result.rules).toContain("PEP_CHECK");
    expect(result.risk).toBe("critical");
  });

  it("ignores transactions outside the one-hour velocity window", () => {
    const old = Array.from({ length: 10 }, (_, i) => tx(`old-${i}`, 1_000n, new Date(now.getTime() - 61 * 60_000 - i * 1_000)));
    const result = scoreAml(tx("current", 1_000n), old, { customerId: "cust-1" });
    expect(result.rules).not.toContain("VELOCITY_GT_5_TXNS_PER_HOUR");
    expect(result.risk).toBe("low");
  });
});
