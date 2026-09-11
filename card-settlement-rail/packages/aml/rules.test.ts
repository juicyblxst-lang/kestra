import { describe, expect, it } from 'vitest';
import { evaluateFraudRules, type AmlEvent } from './rules';

const now = new Date('2026-01-01T12:00:00.000Z');
const event = (overrides: Partial<AmlEvent> = {}): AmlEvent => ({
  accountId: 'acct-1', amount: 100, occurredAt: now.toISOString(), ...overrides,
});

const withTimes = (items: AmlEvent[], minutesAgo: number[]): AmlEvent[] =>
  items.map((item, index) => ({ ...item, occurredAt: new Date(now.getTime() - minutesAgo[index] * 60_000).toISOString() }));

describe('AML fraud rules', () => {
  it('flags account velocity', () => {
    const events = withTimes(Array.from({ length: 10 }, () => event()), Array(10).fill(2));
    const result = evaluateFraudRules({ events, now });
    expect(result.rules).toContain('VELOCITY_10_IN_10M');
    expect(result.risk).toBe('medium');
  });

  it('flags potential structuring', () => {
    const events = withTimes(Array.from({ length: 3 }, () => event({ amount: 9_900 })), [1, 2, 3]);
    const result = evaluateFraudRules({ events, now });
    expect(result.rules).toContain('STRUCTURING_3_UNDER_10000');
    expect(result.risk).toBe('high');
  });

  it('flags high-risk geography', () => {
    const result = evaluateFraudRules({ events: [event({ countryCode: 'IR' })], now });
    expect(result.rules).toContain('HIGH_RISK_GEO');
    expect(result.risk).toBe('high');
  });

  it('flags card testing through repeated small transactions', () => {
    const events = withTimes(Array.from({ length: 5 }, () => event({ amount: 1.99, cardFingerprint: 'card-x' })), [1, 2, 3, 4, 5]);
    const result = evaluateFraudRules({ events, now });
    expect(result.rules).toContain('CARD_TESTING_5_SMALL_TXNS');
    expect(result.risk).toBe('high');
  });

  it('flags BIN attacks across distinct sources', () => {
    const events = withTimes(
      Array.from({ length: 8 }, (_, i) => event({ bin: '411111', deviceId: `device-${i}`, amount: 2 })),
      Array(8).fill(1),
    );
    const result = evaluateFraudRules({ events, now });
    expect(result.rules).toContain('BIN_ATTACK_8_UNIQUE_SOURCES');
    expect(result.risk).toBe('critical');
  });

  it('returns low risk when no rule matches', () => {
    const result = evaluateFraudRules({ events: [event({ amount: 125 })], now });
    expect(result).toEqual({ risk: 'low', rules: [] });
  });

  it('ignores stale events outside the rule windows', () => {
    const result = evaluateFraudRules({
      events: Array.from({ length: 10 }, () => event({ occurredAt: '2025-12-31T11:00:00.000Z' })),
      now,
    });
    expect(result.rules).toEqual([]);
  });
});
