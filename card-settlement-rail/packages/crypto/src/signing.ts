import { privateKeyToAccount } from "viem/accounts";
import type { Address, Hex, TypedData } from "viem";

export interface Eip712Input {
  domain: Record<string, unknown> & { name?: string; version?: string; chainId?: number | bigint; verifyingContract?: Address; salt?: Hex };
  types: Record<string, readonly { name: string; type: string }[]>;
  primaryType: string;
  message: Record<string, unknown>;
}

export async function signEip712(privateKey: Hex, input: Eip712Input): Promise<Hex> {
  const account = privateKeyToAccount(privateKey);
  return account.signTypedData({
    domain: input.domain as never,
    types: input.types as never,
    primaryType: input.primaryType as never,
    message: input.message as never,
  });
}

export function assertPrivateKey(value: string): asserts value is Hex {
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) throw new Error("Invalid EVM private key format");
}
