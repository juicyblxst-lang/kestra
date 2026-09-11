import { describe, expect, it, vi } from "vitest";
import { maskPan, maskSensitiveText, redactForLog, safeLog } from "./mask.js";

describe("PCI masking", () => {
  const pan = "4111111111111111";

  it("masks PAN while preserving the last four digits", () => {
    expect(maskPan(pan)).toBe("************1111");
    expect(maskSensitiveText(`card ${pan}`)).toBe("card ************1111");
  });

  it("redacts CVV and card fields", () => {
    const value = redactForLog({ pan, cvv: "123", nested: { cardNumber: pan, cvc: "999" } });
    expect(value).toEqual({ pan: "************1111", cvv: "[REDACTED]", nested: { cardNumber: "************1111", cvc: "[REDACTED]" } });
  });

  it("never emits PAN or CVV through safe logging", () => {
    const logger = vi.fn();
    safeLog(logger)("payment", { pan, cvv: "123" }, `raw PAN=${pan} CVV=123`);
    const output = JSON.stringify(logger.mock.calls);
    expect(output).not.toContain(pan);
    expect(output).not.toContain("123");
    expect(output).toContain("************1111");
    expect(output).toContain("[REDACTED]");
  });

  it("rejects invalid PAN lengths", () => {
    expect(() => maskPan("123456789012")).toThrow();
    expect(() => maskPan("12345678901234567890")).toThrow();
  });
});
