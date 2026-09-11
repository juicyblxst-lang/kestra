import { describe, expect, it } from "vitest";
import { loadDevPrivateKey } from "./keys.js";

describe("development key loader", () => {
  it("loads only the explicitly testnet variable", () => {
    const key = "0x" + "11".repeat(32);
    expect(loadDevPrivateKey({ OPERATOR_PRIVATE_KEY_TESTNET_ONLY: key })).toBe(key);
  });
  it("rejects missing keys", () => expect(() => loadDevPrivateKey({})).toThrow(/required/));
});
