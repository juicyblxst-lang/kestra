import { describe, expect, it } from "vitest";
import { privateKeyToAccount } from "viem/accounts";
import { verifyTypedData } from "viem";
import { signEip712 } from "./signing.js";

const privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123" as `0x${string}`;
const input = {
  domain: { name: "Card Settlement Rail", version: "1", chainId: 97 },
  types: { Payment: [{ name: "paymentId", type: "bytes32" }, { name: "amount", type: "uint256" }] },
  primaryType: "Payment",
  message: { paymentId: `0x${"11".repeat(32)}`, amount: 100n },
};

describe("EIP-712", () => {
  it("signs a typed payment authorization that verifies", async () => {
    const signature = await signEip712(privateKey, input);
    const account = privateKeyToAccount(privateKey);
    await expect(verifyTypedData({ ...input, address: account.address, signature } as never)).resolves.toBe(true);
  });
});
