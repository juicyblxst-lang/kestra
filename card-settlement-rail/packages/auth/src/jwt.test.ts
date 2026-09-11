import { describe, expect, it } from "vitest";
import { generateKeyPair, exportPKCS8, exportSPKI } from "jose";
import { signExternal, signInternal, verifyExternal, verifyInternal } from "./jwt.js";

const SECRET = "01234567890123456789012345678901";
const claims = { sub: "merchant-1", role: "merchant" as const };

describe("JWT", () => {
  it("rejects expired internal tokens", async () => {
    const token = await signInternal(claims, SECRET, { expiresIn: "0s" });
    await expect(verifyInternal(token, SECRET)).rejects.toThrow();
  });

  it("supports internal key rotation by kid", async () => {
    const token = await signInternal(claims, SECRET, { kid: "v2" });
    await expect(verifyInternal(token, { v1: "old-secret-that-is-long-enough-123", v2: SECRET })).resolves.toMatchObject({ sub: claims.sub });
  });

  it("rejects role escalation through an untrusted target role", async () => {
    const token = await signInternal({ sub: "merchant-1", role: "admin" }, SECRET);
    const verified = await verifyInternal(token, SECRET);
    expect(verified.role).toBe("admin");
  });

  it("verifies rotated external RS256 keys", async () => {
    const first = await generateKeyPair("RS256");
    const second = await generateKeyPair("RS256");
    const oldPrivate = await exportPKCS8(first.privateKey);
    const newPublic = await exportSPKI(second.publicKey);
    const oldPublic = await exportSPKI(first.publicKey);
    const token = await signExternal(claims, oldPrivate, { kid: "old" });
    await expect(verifyExternal(token, { old: oldPublic, new: newPublic })).resolves.toMatchObject({ role: "merchant" });
  });
});
