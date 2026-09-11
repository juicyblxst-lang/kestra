import { z } from "zod";

const url = z.string().url();
const secret = z.string().min(1);
const base = z.object({ NODE_ENV: z.enum(["development", "test", "production"]).default("development") });

export const CoreEnvSchema = base.extend({
  DATABASE_URL: url,
  REDIS_URL: url,
  CHAIN_RPC_URL: url,
  JWT_SECRET: z.string().min(32),
  OPERATOR_PRIVATE_KEY_TESTNET_ONLY: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
});

export const EdgeEnvSchema = base.extend({
  CORE_BASE_URL: url,
  INTERNAL_AUTH_TOKEN: secret,
});

export const WorkerEnvSchema = base.extend({
  DATABASE_URL: url,
  REDIS_URL: url,
  CORE_BASE_URL: url,
  WORKER_AUTH_TOKEN: secret,
});

export type CoreEnv = z.infer<typeof CoreEnvSchema>;
export type EdgeEnv = z.infer<typeof EdgeEnvSchema>;
export type WorkerEnv = z.infer<typeof WorkerEnvSchema>;

export function parseEnv<T extends z.ZodTypeAny>(schema: T, env: Record<string, string | undefined> = process.env): z.infer<T> {
  return schema.parse(env);
}
