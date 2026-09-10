import { Result, err, ok } from './result.js';
import { DomainError, domainError } from './errors.js';
export type ULID = string & { readonly __brand: 'ULID' };
const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
export const generateULID = (now = Date.now()): Result<ULID, DomainError> => {
  if (!Number.isSafeInteger(now) || now < 0 || now >= 2 ** 48) return err(domainError('INVALID_ID', 'Timestamp is outside the ULID range'));
  let time = now; let timestamp = '';
  for (let i = 0; i < 10; i++) { timestamp = ENCODING[time % 32] + timestamp; time = Math.floor(time / 32); }
  const bytes = new Uint8Array(10);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  let value = 0; let bits = 0; let random = '';
  for (const byte of bytes) { value = (value << 8) | byte; bits += 8; while (bits >= 5) { bits -= 5; random += ENCODING[(value >> bits) & 31]; } }
  if (bits > 0) random += ENCODING[(value << (5 - bits)) & 31];
  return ok((timestamp + random.slice(0, 16)) as ULID);
};
