export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type AmlEvent = {
  transactionId?: string;
  accountId?: string;
  merchantId?: string;
  amount: number;
  currency?: string;
  occurredAt?: string | Date;
  countryCode?: string;
  bin?: string;
  deviceId?: string;
  ipAddress?: string;
  merchantCategoryCode?: string;
  cardFingerprint?: string;
};

export type RuleContext = {
  events: readonly AmlEvent[];
  now?: Date;
  highRiskCountries?: readonly string[];
  velocityWindowMs?: number;
  velocityThreshold?: number;
  structuringThreshold?: number;
  structuringCountThreshold?: number;
  cardTestingWindowMs?: number;
  cardTestingThreshold?: number;
  binAttackWindowMs?: number;
  binAttackThreshold?: number;
};

export type RuleResult = {
  risk: RiskLevel;
  rules: string[];
};

const DEFAULT_HIGH_RISK_COUNTRIES = ['AF', 'BY', 'CD', 'CU', 'IR', 'IQ', 'KP', 'RU', 'SD', 'SY', 'VE', 'YE'];

const toTime = (value: string | Date | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const riskRank: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2, critical: 3 };

const maxRisk = (rules: string[]): RiskLevel => {
  if (rules.some((r) => r.startsWith('BIN_ATTACK'))) return 'critical';
  if (rules.some((r) => r.startsWith('CARD_TESTING'))) return 'high';
  if (rules.some((r) => r.startsWith('STRUCTURING') || r.startsWith('HIGH_RISK_GEO'))) return 'high';
  if (rules.some((r) => r.startsWith('VELOCITY'))) return 'medium';
  return 'low';
};

export function evaluateFraudRules(context: RuleContext): RuleResult {
  const now = context.now?.getTime() ?? Date.now();
  const events = context.events.filter((event) => toTime(event.occurredAt, now) <= now);
  const rules: string[] = [];

  const velocityWindowMs = context.velocityWindowMs ?? 10 * 60_000;
  const velocityThreshold = context.velocityThreshold ?? 10;
  const accountCounts = new Map<string, number>();
  for (const event of events) {
    const key = event.accountId ?? event.merchantId;
    if (!key) continue;
    if (now - toTime(event.occurredAt, now) <= velocityWindowMs) accountCounts.set(key, (accountCounts.get(key) ?? 0) + 1);
  }
  if ([...accountCounts.values()].some((count) => count >= velocityThreshold)) rules.push(`VELOCITY_${velocityThreshold}_IN_${Math.round(velocityWindowMs / 60_000)}M`);

  const structuringThreshold = context.structuringThreshold ?? 10_000;
  const structuringCountThreshold = context.structuringCountThreshold ?? 3;
  const recentByAccount = new Map<string, AmlEvent[]>();
  for (const event of events) {
    const key = event.accountId ?? event.merchantId;
    if (!key || event.amount >= structuringThreshold || now - toTime(event.occurredAt, now) > 24 * 60 * 60_000) continue;
    const list = recentByAccount.get(key) ?? [];
    list.push(event);
    recentByAccount.set(key, list);
  }
  if ([...recentByAccount.values()].some((items) => items.length >= structuringCountThreshold)) rules.push(`STRUCTURING_${structuringCountThreshold}_UNDER_${structuringThreshold}`);

  const highRiskCountries = new Set((context.highRiskCountries ?? DEFAULT_HIGH_RISK_COUNTRIES).map((c) => c.toUpperCase()));
  if (events.some((event) => event.countryCode && highRiskCountries.has(event.countryCode.toUpperCase()))) rules.push('HIGH_RISK_GEO');

  const cardTestingWindowMs = context.cardTestingWindowMs ?? 15 * 60_000;
  const cardTestingThreshold = context.cardTestingThreshold ?? 5;
  const cardTestingKeys = new Map<string, number>();
  for (const event of events) {
    const key = event.cardFingerprint ?? event.deviceId;
    if (!key || now - toTime(event.occurredAt, now) > cardTestingWindowMs) continue;
    if (event.amount <= 5) cardTestingKeys.set(key, (cardTestingKeys.get(key) ?? 0) + 1);
  }
  if ([...cardTestingKeys.values()].some((count) => count >= cardTestingThreshold)) rules.push(`CARD_TESTING_${cardTestingThreshold}_SMALL_TXNS`);

  const binAttackWindowMs = context.binAttackWindowMs ?? 10 * 60_000;
  const binAttackThreshold = context.binAttackThreshold ?? 8;
  const binCounts = new Map<string, Set<string>>();
  for (const event of events) {
    if (!event.bin || now - toTime(event.occurredAt, now) > binAttackWindowMs) continue;
    const key = event.deviceId ?? event.ipAddress ?? event.accountId ?? event.transactionId;
    if (!key) continue;
    const set = binCounts.get(event.bin) ?? new Set<string>();
    set.add(key);
    binCounts.set(event.bin, set);
  }
  if ([...binCounts.values()].some((keys) => keys.size >= binAttackThreshold)) rules.push(`BIN_ATTACK_${binAttackThreshold}_UNIQUE_SOURCES`);

  const risk = maxRisk(rules);
  return { risk, rules };
}

export const rules = evaluateFraudRules;
