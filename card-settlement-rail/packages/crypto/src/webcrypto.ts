/**
 * DEVELOPMENT-ONLY PII encryption helper.
 * Do not use this module as a production key-management boundary.
 * Production PII encryption must use envelope encryption backed by an HSM/KMS.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function fromBase64(value: string): Uint8Array { return Uint8Array.from(Buffer.from(value, "base64")); }
function toBase64(value: Uint8Array): string { return Buffer.from(value).toString("base64"); }

export interface EncryptedPii { ciphertext: string; iv: string; }

export async function encryptPiiDev(plaintext: string, base64Key: string): Promise<EncryptedPii> {
  if (base64Key.length === 0) throw new Error("Encryption key is required");
  const keyBytes = fromBase64(base64Key);
  if (keyBytes.byteLength !== 32) throw new Error("AES-256-GCM requires a 32-byte key");
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(plaintext)));
  return { ciphertext: toBase64(ciphertext), iv: toBase64(iv) };
}

export async function decryptPiiDev(encrypted: EncryptedPii, base64Key: string): Promise<string> {
  const keyBytes = fromBase64(base64Key);
  if (keyBytes.byteLength !== 32) throw new Error("AES-256-GCM requires a 32-byte key");
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64(encrypted.iv) }, key, fromBase64(encrypted.ciphertext));
  return decoder.decode(plaintext);
}
