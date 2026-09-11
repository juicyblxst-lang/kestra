import { z } from "zod";

export type FeatureFlags = Record<string, boolean>;
const schema = z.record(z.boolean());

export function parseFlags(raw = process.env.FLAGS): FeatureFlags {
  if (!raw) return {};
  try { return schema.parse(JSON.parse(raw)); }
  catch (error) { throw new Error(`Invalid FLAGS JSON: ${error instanceof Error ? error.message : "unknown error"}`); }
}

export function flagEnabled(name: string, flags: FeatureFlags = parseFlags()): boolean {
  return flags[name] === true;
}
