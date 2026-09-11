import { getEnv, CoreEnvSchema } from "./env.js";

export type CredentialName = keyof ReturnType<typeof getCredentialRegistry>;

export class MissingCredential extends Error {
  readonly credential: string;

  constructor(credential: string) {
    super(`MissingCredential: ${credential} is not set. See .env.example for format. Set MOCK_MODE=true to bypass for local dev.`);
    this.name = "MissingCredential";
    this.credential = credential;
  }
}

const credentialNames = [
  "ALCHEMY_API_KEY", "CIRCLE_API_KEY_SANDBOX", "CIRCLE_ENTITY_ID_SANDBOX", "MOONPAY_API_KEY_SANDBOX",
  "TRANSAK_API_KEY_SANDBOX", "PERSONA_API_KEY", "CHAINALYSIS_API_KEY", "ELLIPTIC_API_KEY", "TRM_LABS_API_KEY",
  "AFRICASTALKING_API_KEY_SANDBOX", "MTN_MOMO_API_KEY_SANDBOX", "MPESA_CONSUMER_KEY_SANDBOX", "RESEND_API_KEY",
  "TWILIO_AUTH_TOKEN", "GRAFANA_CLOUD_API_KEY", "UPTIMEROBOT_API_KEY", "POSTHOG_API_KEY", "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_JWT_SECRET", "UPSTASH_REDIS_REST_TOKEN", "QSTASH_TOKEN",
  "QSTASH_CURRENT_SIGNING_KEY", "QSTASH_NEXT_SIGNING_KEY", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY",
  "EXPO_TOKEN", "WALLETCONNECT_PROJECT_ID", "ETHERSCAN_API_KEY", "GH_PACKAGES_TOKEN", "AXELAR_API_KEY",
  "WEBHOOK_SIGNING_KEY", "CIRCLE_WEBHOOK_SECRET", "MOONPAY_WEBHOOK_SECRET", "TRANSAK_WEBHOOK_SECRET",
  "PERSONA_WEBHOOK_SECRET", "CHAINALYSIS_WEBHOOK_SECRET", "JWT_SECRET", "API_KEY_PEPPER", "OPERATOR_PRIVATE_KEY",
  "OPERATOR_PRIVATE_KEY_TESTNET_ONLY", "DEPLOYER_PRIVATE_KEY", "ORACLE_PRIVATE_KEY", "INTERNAL_AUTH_TOKEN", "WORKER_AUTH_TOKEN",
] as const;

function getCredentialRegistry() {
  return Object.fromEntries(credentialNames.map((name) => [name, name])) as Record<(typeof credentialNames)[number], (typeof credentialNames)[number]>;
}

export function isMockMode(env: Record<string, string | undefined> = process.env): boolean {
  return getEnv(CoreEnvSchema, env).MOCK_MODE;
}

export function getCredential(name: CredentialName, env: Record<string, string | undefined> = process.env): string {
  const value = env[name];
  if (value) return value;
  throw new MissingCredential(name);
}

export function getCredentialOrMock<T extends string>(name: CredentialName, mockValue: T, env: Record<string, string | undefined> = process.env): string | T {
  const value = env[name];
  if (value) return value;
  if (isMockMode(env)) return mockValue;
  throw new MissingCredential(name);
}

export function assertCredential(name: CredentialName, env: Record<string, string | undefined> = process.env): asserts env is Record<string, string> {
  getCredential(name, env);
}

export function getCredentialNames(): readonly CredentialName[] {
  return credentialNames;
}

export function redactSecrets(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .replace(/0x[0-9a-fA-F]{64}/g, "[REDACTED]")
      .replace(/(Bearer\s+)[^\s]+/gi, "$1[REDACTED]")
      .replace(/(api[_-]?key|token|secret|password|private[_-]?key)(\s*[:=]\s*)[^,\s}]+/gi, "$1$2[REDACTED]");
  }
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, /key|token|secret|password|credential/i.test(k) ? "[REDACTED]" : redactSecrets(v)]));
  return value;
}
