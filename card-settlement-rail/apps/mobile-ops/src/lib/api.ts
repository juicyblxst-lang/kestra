import { CardSettlementClient } from "@card-settlement/sdk-node";

const baseUrl = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

export const sdk = new CardSettlementClient({ baseUrl });

export type Settlement = {
  id: string;
  settlementReference: string;
  merchantId: string;
  batchId: string;
  amount: string;
  fees: string;
  netAmount: string;
  currency: string;
  status: "pending" | "processing" | "settled" | "failed" | "reversed";
  settledAt?: string | null;
  createdAt: string;
};

export const api = {
  sdk,
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { accept: "application/json" },
    });
    const text = await response.text();
    let body: unknown;
    try { body = text ? JSON.parse(text) : undefined; } catch { body = text; }
    if (!response.ok) throw new Error(`API request failed (${response.status})`);
    return body as T;
  },
  settlements: {
    list: () => api.get<Settlement[]>("/settlements"),
    get: (id: string) => api.get<Settlement>(`/settlements/${encodeURIComponent(id)}`),
  },
};
