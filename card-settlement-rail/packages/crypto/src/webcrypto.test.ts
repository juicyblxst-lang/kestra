import { describe, expect, it } from "vitest";
import { randomBytes } from "node:crypto";
import { decryptPiiDev, encryptPiiDev } from "./webcrypto.js";

describe("development PII crypto", () => {
  it("round trips AES-GCM", async () => {
    const key = randomBytes(32).toString("base64");
    const encrypted = await encryptPiiDev("customer@example.com", key);
    await expect(decryptPiiDev(encrypted, key)).resolves.toBe("customer@example.com");
  });
  it("rejects invalid key sizes", async () => {
    await expect(encryptPiiDev("x", Buffer.alloc(8).toString("base64"))).rejects.toThrow(/32-byte/);
  });
});
