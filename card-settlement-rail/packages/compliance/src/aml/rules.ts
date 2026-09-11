export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface AmlTransaction {
  id: string;
  customerId: string;
  amountMinor: bigint;
  currency: string;
  timestamp: Date;
  country?: string;
}

export interface AmlProfile {
  customerId: string;
  isPep?: boolean;
  country?: string;
}

export interface AmlAssessment {
  risk: RiskLevel;
  rules: string[];
}

export interface AmlRulesConfig {
  velocityWindowMs: number;
  velocityThreshold: number;
  structuringLowerMinor: bigint;
  structuringUpperMinor: bigint;
  highRiskCountries: ReadonlySet<string>;
}

export const DEFAULT_AML_CONFIG: AmlRulesConfig = {
  velocityWindowMs: 60 * 60 * 1000,
  velocityThreshold: 5,
  structuringLowerMinor: 900_000n,
  structuringUpperMinor: 1_000_000n,
  highRiskCountries: new Set(["AF", "BY", "IR", "KP", "LY", "MM", "RU", "SO", "SY", "YE"]),
};

const riskRank: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2, critical: 3 };

function maxRisk(current: RiskLevel, candidate: RiskLevel): RiskLevel {
  return riskRank[candidate] > riskRank[current] ? candidate : current;
}

export function scoreAml(
  transaction: AmlTransaction,
  recentTransactions: readonly AmlTransaction[],
  profile: AmlProfile,
  config: AmlRulesConfig = DEFAULT_AML_CONFIG,
): AmlAssessment {
  const rules: string[] = [];
  let risk: RiskLevel = "low";
  const now = transaction.timestamp.getTime();
  const windowStart = now - config.velocityWindowMs;
  const velocity = recentTransactions.filter((tx) =>
    tx.customerId === transaction.customerId &&
    tx.timestamp.getTime() >= windowStart &&
    tx.timestamp.getTime() <= now,
  ).length + 1;

  if (velocity > config.velocityThreshold) {
    rules.push("VELOCITY_GT_5_TXNS_PER_HOUR");
    risk = maxRisk(risk, "high");
  }

  const amount = transaction.amountMinor;
  const structuring = amount >= config.structuringLowerMinor && amount < config.structuringUpperMinor;
  if (structuring) {
    rules.push("STRUCTURING_JUST_UNDER_10K");
    risk = maxRisk(risk, "high");
  }

  const country = (transaction.country ?? profile.country ?? "").trim().toUpperCase();
  if (config.highRiskCountries.has(country)) {
    rules.push("HIGH_RISK_GEO");
    risk = maxRisk(risk, "high");
  }

  if (profile.isPep) {
    rules.push("PEP_CHECK");
    risk = maxRisk(risk, "critical");
  }

  return { risk, rules };
}
