import { createHash, timingSafeEqual } from "node:crypto";

export interface ApiKeyDigest {
  id: string;
  digest: string;
}

function hex(value: Buffer): string { return value.toString("hex"); }

export function hashApiKey(secret: string, pepper: string): string {
  if (pepper.length < 32) throw new Error("API-key pepper must be at least 32 characters");
  return createHash("sha256").update(pepper, "utf8").update("\\0", "utf8").update(secret, "utf8").digest("hex");
}

export function createApiKeyDigest(id: string, secret: string, pepper: string): ApiKeyDigest {
  if (!id) throw new Error("API-key id is required");
  return { id, digest: hashApiKey(secret, pepper) };
}

export function verifyApiKey(secret: string, storedDigest: string, pepper: string): boolean {
  const actual = Buffer.from(hashApiKey(secret, pepper), "hex");
  const expected = Buffer.from(storedDigest, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
