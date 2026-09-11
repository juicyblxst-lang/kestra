import { Hono } from 'hono';

type Env = { Bindings: { QSTASH_URL?: string; QSTASH_TOKEN?: string; CORE_BASE_URL?: string } };
const app = new Hono<Env>();
app.get('/health', c => c.json({ service: 'payout', status: 'ok' }));
app.post('/payout', async c => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => null);
  if (!body || typeof body !== 'object') return c.json({ error: 'invalid_json' }, 400);
  const url = c.env.QSTASH_URL;
  const token = c.env.QSTASH_TOKEN;
  const destination = c.env.CORE_BASE_URL;
  if (!url || !token || !destination) return c.json({ error: 'queue_not_configured' }, 503);
  const response = await fetch(url, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'upstash-forward-to': `${destination.replace(/\/$/, '')}/internal/payouts` }, body: JSON.stringify(body) });
  if (!response.ok) return c.json({ error: 'queue_failed' }, 502);
  return c.json({ accepted: true, status: 'queued' }, 202);
});
export default app;
