import { Hono } from "hono";
import { scoreAml, type AmlProfile, type AmlTransaction } from "../../../../packages/compliance/src/index";

const app = new Hono();

function parseTransaction(value: unknown): AmlTransaction {
  if (!value || typeof value !== "object") throw new Error("INVALID_TRANSACTION");
  const item = value as Record<string, unknown>;
  if (typeof item.id !== "string" || typeof item.customerId !== "string" || typeof item.amountMinor !== "string" || typeof item.timestamp !== "string") {
    throw new Error("INVALID_TRANSACTION");
  }
  const timestamp = new Date(item.timestamp);
  if (Number.isNaN(timestamp.getTime())) throw new Error("INVALID_TIMESTAMP");
  let amountMinor: bigint;
  try {
    amountMinor = BigInt(item.amountMinor);
  } catch {
    throw new Error("INVALID_AMOUNT");
  }
  if (amountMinor < 0n) throw new Error("INVALID_AMOUNT");
  return {
    id: item.id,
    customerId: item.customerId,
    amountMinor,
    currency: typeof item.currency === "string" ? item.currency : "USD",
    timestamp,
    ...(typeof item.country === "string" ? { country: item.country } : {}),
  };
}

app.get("/health", (c) => c.json({ ok: true, service: "aml" }));

app.post("/score", async (c) => {
  let body: unknown;
  try { body = await c.req.json(); } catch { return c.json({ error: "INVALID_JSON" }, 400); }
  if (!body || typeof body !== "object") return c.json({ error: "INVALID_REQUEST" }, 400);

  try {
    const value = body as Record<string, unknown>;
    const transaction = parseTransaction(value.transaction);
    const recentRaw = Array.isArray(value.recentTransactions) ? value.recentTransactions : [];
    const recentTransactions = recentRaw.map(parseTransaction);
    const profileRaw = value.profile;
    if (!profileRaw || typeof profileRaw !== "object" || typeof (profileRaw as Record<string, unknown>).customerId !== "string") {
      throw new Error("INVALID_PROFILE");
    }
    const profileValue = profileRaw as Record<string, unknown>;
    const profile: AmlProfile = {
      customerId: profileValue.customerId as string,
      ...(typeof profileValue.isPep === "boolean" ? { isPep: profileValue.isPep } : {}),
      ...(typeof profileValue.country === "string" ? { country: profileValue.country } : {}),
    };
    if (profile.customerId !== transaction.customerId) return c.json({ error: "CUSTOMER_MISMATCH" }, 400);

    const result = scoreAml(transaction, recentTransactions, profile);
    return c.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "INVALID_REQUEST";
    return c.json({ error: message }, 400);
  }
});

export default app;
