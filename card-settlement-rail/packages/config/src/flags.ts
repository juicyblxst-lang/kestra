import { z } from "zod";
import { parseEnv } from "./env.js";

export type FeatureFlags = Record<string, boolean>;
const schema = z.record(z.boolean());

export function parseFlags(env: Record<string, string | undefined> = process.env): FeatureFlags {
  const raw = env.FLAGS;
  if (!raw) return {};
  try {
    return schema.parse(JSON.parse(raw));
  } catch (error) {
    throw new Error(`Invalid FLAGS JSON: ${error instanceof Error ? error.message : "unknown error"}`);
  }
}

export function flagEnabled(name: string, flags?: FeatureFlags, env: Record<string, string | undefined> = process.env): boolean {
  return (flags ?? parseFlags(env))[name] === true;
}
