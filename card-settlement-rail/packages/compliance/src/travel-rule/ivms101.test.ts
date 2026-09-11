import { describe, expect, it } from "vitest";
import { decodeIvms101, encodeIvms101, type Ivms101Message } from "./ivms101.js";

const message: Ivms101Message = {
  originator: { name: "Alice Example", accountNumber: "acct:originator", country: "NG" },
  beneficiary: { name: "Bob Example", accountNumber: "acct:beneficiary", country: "GB" },
  asset: "USD",
  amount: "12500.00",
  transactionId: "txn-123",
  timestamp: "2026-09-10T12:00:00.000Z",
};

describe("IVMS101 JSON codec", () => {
  it("round-trips a valid message without data loss", () => {
    expect(decodeIvms101(encodeIvms101(message))).toEqual(message);
  });

  it("rejects malformed JSON", () => {
    expect(() => decodeIvms101("not-json")).toThrow("Invalid IVMS101 JSON");
  });

  it("rejects unsupported versions", () => {
    expect(() => decodeIvms101(JSON.stringify({ ivms101: "2.0" }))).toThrow("Unsupported IVMS101 version");
  });

  it("rejects missing mandatory transfer fields", () => {
    expect(() => encodeIvms101({ ...message, transactionId: "" })).toThrow();
  });
});
