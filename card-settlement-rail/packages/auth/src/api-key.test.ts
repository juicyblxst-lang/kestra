import { describe, expect, it } from "vitest";
import { createApiKeyDigest, verifyApiKey } from "./api-key.js";

describe("API keys", () => {
  const pepper = "pepper-pepper-pepper-pepper-pepper-123";
  it("hashes and verifies without storing the raw secret", () => {
    const digest = createApiKeyDigest("k1", "secret-value", pepper);
    expect(digest.digest).not.toContain("secret-value");
    expect(verifyApiKey("secret-value", digest.digest, pepper)).toBe(true);
    expect(verifyApiKey("wrong", digest.digest, pepper)).toBe(false);
  });
});
