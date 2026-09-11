import type { Hex } from "viem";
import { assertPrivateKey } from "./signing.js";

/**
 * DEVELOPMENT / TESTNET ONLY.
 * DO NOT USE ON MAINNET.
 * Private keys must be replaced with HSM/KMS-backed signing before production.
 */
export function loadDevPrivateKey(env: NodeJS.ProcessEnv = process.env): Hex {
  const value = env.OPERATOR_PRIVATE_KEY_TESTNET_ONLY;
  if (!value) throw new Error("OPERATOR_PRIVATE_KEY_TESTNET_ONLY is required");
  assertPrivateKey(value);
  return value;
}

export function loadRequiredSecret(name: string, env: NodeJS.ProcessEnv = process.env): string {
  const value = env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}
