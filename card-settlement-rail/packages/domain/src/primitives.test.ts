import { describe, expect, it } from 'vitest';
import { Instant } from '../src/instant.js';
import { generateULID } from '../src/ulid.js';
import { Result, ok, err } from '../src/result.js';

describe('domain primitives', () => {
  it('validates UTC instants', () => {
    expect(Instant.from('2026-01-01T00:00:00.000Z').ok).toBe(true);
    expect(Instant.from('2026-01-01T00:00:00Z').ok).toBe(false);
    expect(Instant.from('not-a-date').ok).toBe(false);
    expect(Instant.now()).toMatch(/Z$/);
  });
  it('generates ULIDs and rejects invalid timestamps', () => {
    const a = generateULID(0); const b = generateULID(1);
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) { expect(a.value).toHaveLength(26); expect(b.value).toHaveLength(26); expect(a.value < b.value).toBe(true); }
    expect(generateULID(-1).ok).toBe(false);
    expect(generateULID(2 ** 48).ok).toBe(false);
  });
  it('sequences successful and failed results', () => {
    expect(Result.sequence([ok(1), ok(2)])).toEqual({ ok: true, value: [1, 2] });
    const failure = err('bad'); expect(Result.sequence([ok(1), failure])).toBe(failure);
  });
});
