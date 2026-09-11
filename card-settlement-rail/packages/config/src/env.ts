import { z } from "zod";

const url = z.string().url();
const secret = z.string().min(1);
const token = z.string().min(16);
const privateKey = z.string().regex(/^0x[0-9a-fA-F]{64}$/);
const rate = z.coerce.number().min(0).max(1).default(1);
const base = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MOCK_MODE: z.coerce.boolean().default(true),
  SERVICE_NAME: z.string().min(1).default("card-settlement-rail"),
  SERVICE_VERSION: z.string().min(1).default("0.1.0"),
  OTEL_SAMPLE_RATE: rate,
  FLAGS: z.string().optional(),
});

const infrastructure = {
  DATABASE_URL: url,
  REDIS_URL: url,
  CORE_BASE_URL: url,
  INTERNAL_AUTH_TOKEN: token,
  WORKER_AUTH_TOKEN: token,
};

const blockchain = {
  CHAIN_RPC_URL: url,
  BASE_SEPOLIA_RPC_URL: url.optional(),
  ARBITRUM_SEPOLIA_RPC_URL: url.optional(),
  POLYGON_AMOY_RPC_URL: url.optional(),
  OPTIMISM_SEPOLIA_RPC_URL: url.optional(),
  OPERATOR_PRIVATE_KEY: privateKey.optional(),
  OPERATOR_PRIVATE_KEY_TESTNET_ONLY: privateKey.optional(),
  DEPLOYER_PRIVATE_KEY: privateKey.optional(),
  ORACLE_PRIVATE_KEY: privateKey.optional(),
};

const auth = {
  JWT_SECRET: secret.min(32).optional(),
  API_KEY_PEPPER: secret.min(32).optional(),
  SIWE_DOMAIN: z.string().min(1).optional(),
  EIP712_DOMAIN_NAME: z.string().min(1).optional(),
  EIP712_DOMAIN_VERSION: z.string().min(1).optional(),
  EIP712_DOMAIN_CHAIN_ID: z.coerce.number().int().positive().optional(),
  EIP712_DOMAIN_VERIFYING_CONTRACT: z.string().regex(/^0x[0-9a-fA-F]{40}$/).optional(),
};

const integrations = {
  ALCHEMY_API_KEY: z.string().regex(/^alch_(test|main)_[a-z0-9]{24}$/).optional(),
  SOLANA_DEVNET_RPC_URL: url.optional(),
  STELLAR_TESTNET_RPC_URL: url.optional(),
  ORACLE_RPC_URL: url.optional(),
  CIRCLE_API_KEY_SANDBOX: secret.optional(),
  CIRCLE_ENTITY_ID_SANDBOX: secret.optional(),
  MOONPAY_API_KEY_SANDBOX: secret.optional(),
  TRANSAK_API_KEY_SANDBOX: secret.optional(),
  PERSONA_API_KEY: secret.optional(),
  OPENSANCTIONS_DATA_URL: url.optional(),
  CHAINALYSIS_API_KEY: secret.optional(),
  ELLIPTIC_API_KEY: secret.optional(),
  TRM_LABS_API_KEY: secret.optional(),
  AFRICASTALKING_API_KEY_SANDBOX: secret.optional(),
  MTN_MOMO_API_KEY_SANDBOX: secret.optional(),
  MPESA_CONSUMER_KEY_SANDBOX: secret.optional(),
  RESEND_API_KEY: z.string().regex(/^re_[A-Za-z0-9_\-]{16,}$/).optional(),
  TWILIO_AUTH_TOKEN: secret.optional(),
  SENTRY_DSN: url.optional(),
  GRAFANA_CLOUD_API_KEY: secret.optional(),
  UPTIMEROBOT_API_KEY: secret.optional(),
  POSTHOG_API_KEY: secret.optional(),
  SUPABASE_URL: z.string().url().regex(/^https:\/\/[a-z0-9-]+\.supabase\.co$/).optional(),
  SUPABASE_ANON_KEY: token.optional(),
  SUPABASE_SERVICE_ROLE_KEY: token.optional(),
  SUPABASE_JWT_SECRET: secret.min(32).optional(),
  SUPABASE_DB_URL: url.optional(),
  UPSTASH_REDIS_REST_URL: url.optional(),
  UPSTASH_REDIS_REST_TOKEN: token.optional(),
  QSTASH_TOKEN: token.optional(),
  QSTASH_CURRENT_SIGNING_KEY: token.optional(),
  QSTASH_NEXT_SIGNING_KEY: token.optional(),
  R2_ACCESS_KEY_ID: secret.optional(),
  R2_SECRET_ACCESS_KEY: secret.optional(),
  R2_BUCKET_NAME: z.string().min(1).optional(),
  KV_NAMESPACE_ID: z.string().regex(/^[a-f0-9]{32}$/).optional(),
  EXPO_TOKEN: token.optional(),
  WALLETCONNECT_PROJECT_ID: z.string().regex(/^[a-f0-9]{32}$/).optional(),
  ETHERSCAN_API_KEY: secret.optional(),
  GH_PACKAGES_TOKEN: token.optional(),
  LAYERZERO_ENDPOINT: url.optional(),
  WORMHOLE_ENDPOINT: url.optional(),
  AXELAR_API_KEY: secret.optional(),
  WEBHOOK_SIGNING_KEY: secret.min(32).optional(),
  CIRCLE_WEBHOOK_SECRET: secret.optional(),
  MOONPAY_WEBHOOK_SECRET: secret.optional(),
  TRANSAK_WEBHOOK_SECRET: secret.optional(),
  PERSONA_WEBHOOK_SECRET: secret.optional(),
  CHAINALYSIS_WEBHOOK_SECRET: secret.optional(),
};

export const CoreEnvSchema = base.extend({
  ...infrastructure,
  ...blockchain,
  ...auth,
  ...integrations,
});

export const EdgeEnvSchema = base.extend({
  ...infrastructure,
  ...integrations,
});

export const WorkerEnvSchema = base.extend({
  ...infrastructure,
  ...integrations,
});

export const ContractEnvSchema = base.extend({
  ...blockchain,
  ETHERSCAN_API_KEY: integrations.ETHERSCAN_API_KEY,
  CHAIN: z.string().min(1).optional(),
});

export const WebEnvSchema = base.extend({
  NEXT_PUBLIC_CORE_BASE_URL: url.optional(),
  NEXT_PUBLIC_CHAIN_ID: z.coerce.number().int().positive().default(84532),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: integrations.WALLETCONNECT_PROJECT_ID,
});

export const MobileEnvSchema = base.extend({
  EXPO_PUBLIC_CORE_BASE_URL: url.optional(),
  EXPO_PUBLIC_CHAIN_ID: z.coerce.number().int().positive().default(84532),
  EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID: integrations.WALLETCONNECT_PROJECT_ID,
  EXPO_TOKEN: integrations.EXPO_TOKEN,
});

export const SdkEnvSchema = base.extend({
  CORE_BASE_URL: url.optional(),
  SDK_API_KEY: token.optional(),
  WEBHOOK_SIGNING_KEY: integrations.WEBHOOK_SIGNING_KEY,
});

export type CoreEnv = z.infer<typeof CoreEnvSchema>;
export type EdgeEnv = z.infer<typeof EdgeEnvSchema>;
export type WorkerEnv = z.infer<typeof WorkerEnvSchema>;
export type ContractEnv = z.infer<typeof ContractEnvSchema>;
export type WebEnv = z.infer<typeof WebEnvSchema>;
export type MobileEnv = z.infer<typeof MobileEnvSchema>;
export type SdkEnv = z.infer<typeof SdkEnvSchema>;

export function parseEnv<T extends z.ZodTypeAny>(schema: T, env: Record<string, string | undefined> = process.env): z.infer<T> {
  return schema.parse(env);
}

export function getEnv<T extends z.ZodTypeAny>(schema: T, env: Record<string, string | undefined> = process.env): z.infer<T> {
  return parseEnv(schema, env);
}
