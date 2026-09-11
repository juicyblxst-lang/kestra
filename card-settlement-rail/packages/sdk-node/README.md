# @card-settlement/sdk-node

Typed Node.js client for Card Settlement Rail. The HTTP surface is represented by the checked-in `src/openapi.d.ts` static artifact generated from the API contract; it is intentionally not generated from a live service in Round 1.

```ts
import { CardSettlementClient } from '@card-settlement/sdk-node';
const client = new CardSettlementClient({ baseUrl: 'https://api.example.invalid', apiKey: process.env.CSR_API_KEY });
await client.payout({ merchant_id: 'm_123', amount: '10000', currency: 'USD', destination: 'acct_123' });
```

Webhook signatures use HMAC-SHA256 over the exact raw request body. Verify before JSON parsing and use the same secret configured for the merchant endpoint.
