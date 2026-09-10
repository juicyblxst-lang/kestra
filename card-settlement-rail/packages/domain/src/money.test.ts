import { describe, expect, it } from 'vitest';
import { Money } from '../src/money.js';

describe('Money', () => {
  it('constructs non-negative minor units', () => {
    const result = Money.fromMinor(123n, 'USD');
    expect(result.ok).toBe(true);
    if (result.ok) { expect(result.value.minor).toBe(123n); expect(result.value.currency).toBe('USD'); }
  });
  it('rejects an unsupported runtime currency', () => expect(Money.fromMinor(1n, 'XXX' as 'USD')).toMatchObject({ ok: false, error: { code: 'INVALID_CURRENCY' } }));
  it('rejects negative amounts', () => expect(Money.fromMinor(-1n, 'USD')).toMatchObject({ ok: false, error: { code: 'NEGATIVE_MONEY' } }));
  it('creates zero', () => expect(Money.zero('JPY')).toMatchObject({ ok: true, value: { minor: 0n, currency: 'JPY' } }));
  it('adds same-currency values', () => {
    const a = Money.fromMinor(100n, 'USD'); const b = Money.fromMinor(25n, 'USD');
    expect(a.ok && b.ok ? a.value.add(b.value) : null).toMatchObject({ ok: true, value: { minor: 125n, currency: 'USD' } });
  });
  it('rejects currency mismatch on add', () => {
    const a = Money.fromMinor(100n, 'USD'); const b = Money.fromMinor(25n, 'EUR');
    expect(a.ok && b.ok ? a.value.add(b.value) : null).toMatchObject({ ok: false, error: { code: 'CURRENCY_MISMATCH' } });
  });
  it('subtracts and rejects overdrafts', () => {
    const a = Money.fromMinor(100n, 'USD'); const b = Money.fromMinor(25n, 'USD'); const c = Money.fromMinor(101n, 'USD');
    expect(a.ok && b.ok ? a.value.subtract(b.value) : null).toMatchObject({ ok: true, value: { minor: 75n } });
    expect(a.ok && c.ok ? a.value.subtract(c.value) : null).toMatchObject({ ok: false, error: { code: 'INSUFFICIENT_FUNDS' } });
  });
  it('rejects currency mismatch on subtract', () => {
    const a = Money.fromMinor(100n, 'USD'); const b = Money.fromMinor(1n, 'EUR');
    expect(a.ok && b.ok ? a.value.subtract(b.value) : null).toMatchObject({ ok: false, error: { code: 'CURRENCY_MISMATCH' } });
  });
  it('allocates exactly and distributes remainder round-robin', () => {
    const a = Money.fromMinor(10n, 'USD');
    expect(a.ok ? a.value.allocate([1n, 1n, 1n]) : null).toMatchObject({ ok: true, value: [{ minor: 4n }, { minor: 3n }, { minor: 3n }] });
    expect(a.ok ? a.value.allocate([1n, 1n]) : null).toMatchObject({ ok: true, value: [{ minor: 5n }, { minor: 5n }] });
  });
  it('rejects invalid allocations', () => {
    const a = Money.fromMinor(10n, 'USD');
    if (!a.ok) return;
    expect(a.value.allocate([])).toMatchObject({ ok: false, error: { code: 'INVALID_ALLOCATION' } });
    expect(a.value.allocate([-1n, 1n])).toMatchObject({ ok: false, error: { code: 'INVALID_ALLOCATION' } });
    expect(a.value.allocate([0n, 0n])).toMatchObject({ ok: false, error: { code: 'INVALID_ALLOCATION' } });
  });
  it('compares and formats values', () => {
    const a = Money.fromMinor(42n, 'USD'); const b = Money.fromMinor(42n, 'USD'); const c = Money.fromMinor(43n, 'USD');
    if (!a.ok || !b.ok || !c.ok) return;
    expect(a.value.equals(b.value)).toBe(true); expect(a.value.equals(c.value)).toBe(false); expect(a.value.toString()).toBe('USD 42');
  });
});
