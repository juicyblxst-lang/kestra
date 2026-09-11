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

export type RuleResult = { risk: RiskLevel; rules: string[] };

const DEFAULT_HIGH_RISK_COUNTRIES = ['AF', 'BY', 'CD', 'CU', 'IR', 'IQ', 'KP', 'RU', 'SD', 'SY', 'VE', 'YE'];
const DAY_MS = 24 * 60 * 60_000;

const toTime = (value: string | Date | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const maxRisk = (rules: string[]): RiskLevel => {
  if (rules.some((r) => r.startsWith('BIN_ATTACK'))) return 'critical';
  if (rules.some((r) => r.startsWith('CARD_TESTING') || r.startsWith('STRUCTURING') || r.startsWith('HIGH_RISK_GEO'))) return 'high';
  if (rules.some((r) => r.startsWith('VELOCITY'))) return 'medium';
  return 'low';
};

/**
 * Deterministic, explainable fraud controls shared by Compliance.
 * Inputs are transaction telemetry only; this package deliberately has no ML/LLM dependency.
 */
export function evaluateFraudRules(context: RuleContext): RuleResult {
  const now = context.now?.getTime() ?? Date.now();
  const events = context.events.filter((event) => toTime(event.occurredAt, now) <= now);
  const rules: string[] = [];

  // Velocity: repeated activity from one account in a short operational window.
  const velocityWindowMs = context.velocityWindowMs ?? 10 * 60_000;
  const velocityThreshold = context.velocityThreshold ?? 10;
  const accountCounts = new Map<string, number>();
  for (const event of events) {
    const key = event.accountId ?? event.merchantId;
    if (!key || now - toTime(event.occurredAt, now) > velocityWindowMs) continue;
    accountCounts.set(key, (accountCounts.get(key) ?? 0) + 1);
  }
  if ([...accountCounts.values()].some((count) => count >= velocityThreshold)) {
    rules.push(`VELOCITY_${velocityThreshold}_IN_${Math.round(velocityWindowMs / 60_000)}M`);
  }

  // Structuring: several below-threshold transactions whose aggregate reaches the threshold.
  const structuringThreshold = context.structuringThreshold ?? 10_000;
  const structuringCountThreshold = context.structuringCountThreshold ?? 3;
  const recentByAccount = new Map<string, AmlEvent[]>();
  for (const event of events) {
    const key = event.accountId ?? event.merchantId;
    if (!key || event.amount <= 0 || event.amount >= structuringThreshold || now - toTime(event.occurredAt, now) > DAY_MS) continue;
    const list = recentByAccount.get(key) ?? [];
    list.push(event);
    recentByAccount.set(key, list);
  }
  if ([...recentByAccount.values()].some((items) => {
    if (items.length < structuringCountThreshold) return false;
    const currencies = new Set(items.map((item) => item.currency ?? 'UNKNOWN'));
    if (currencies.size > 1) return false;
    return items.reduce((sum, item) => sum + item.amount, 0) >= structuringThreshold;
  })) {
    rules.push(`STRUCTURING_${structuringCountThreshold}_UNDER_${structuringThreshold}`);
  }

  // Geo: configurable high-risk/sanctions-sensitive country list; never hard-code a jurisdiction decision elsewhere.
  const highRiskCountries = new Set((context.highRiskCountries ?? DEFAULT_HIGH_RISK_COUNTRIES).map((country) => country.toUpperCase()));
  if (events.some((event) => event.countryCode && highRiskCountries.has(event.countryCode.toUpperCase()))) {
    rules.push('HIGH_RISK_GEO');
  }

  // Card testing: repeated low-value attempts from the same card/device in a short window.
  const cardTestingWindowMs = context.cardTestingWindowMs ?? 15 * 60_000;
  const cardTestingThreshold = context.cardTestingThreshold ?? 5;
  const cardTestingCounts = new Map<string, number>();
  for (const event of events) {
    const key = event.cardFingerprint ?? event.deviceId;
    if (!key || event.amount <= 0 || event.amount > 5 || now - toTime(event.occurredAt, now) > cardTestingWindowMs) continue;
    cardTestingCounts.set(key, (cardTestingCounts.get(key) ?? 0) + 1);
  }
  if ([...cardTestingCounts.values()].some((count) => count >= cardTestingThreshold)) {
    rules.push(`CARD_TESTING_${cardTestingThreshold}_SMALL_TXNS`);
  }

  // BIN attack: one BIN observed across many distinct device/IP/account sources.
  const binAttackWindowMs = context.binAttackWindowMs ?? 10 * 60_000;
  const binAttackThreshold = context.binAttackThreshold ?? 8;
  const binSources = new Map<string, Set<string>>();
  for (const event of events) {
    if (!event.bin || now - toTime(event.occurredAt, now) > binAttackWindowMs) continue;
    const source = event.deviceId ?? event.ipAddress ?? event.accountId ?? event.transactionId;
    if (!source) continue;
    const sources = binSources.get(event.bin) ?? new Set<string>();
    sources.add(source);
    binSources.set(event.bin, sources);
  }
  if ([...binSources.values()].some((sources) => sources.size >= binAttackThreshold)) {
    rules.push(`BIN_ATTACK_${binAttackThreshold}_UNIQUE_SOURCES`);
  }

  return { risk: maxRisk(rules), rules };
}

export const rules = evaluateFraudRules;
