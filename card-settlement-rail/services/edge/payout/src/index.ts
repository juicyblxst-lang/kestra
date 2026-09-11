import { Hono } from 'hono';

type Env = { Bindings: { MOCK_MODE?: string; QSTASH_URL?: string; QSTASH_TOKEN?: string; CORE_BASE_URL?: string } };
const app = new Hono<Env>();

function mockMode(env: Env['Bindings']) { return env.MOCK_MODE === undefined || env.MOCK_MODE === 'true'; }
function qstashUrl(base: string, destination: string) { const b = base.replace(/\/$/, ''); if (b.includes('{destination}')) return b.replace('{destination}', destination); if (/\/publish$/.test(b)) return `${b}/${destination}`; return `${b}/v2/publish/${destination}`; }
async function postWithTimeout(url: string, init: RequestInit, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try { return await fetch(url, { ...init, signal: controller.signal }); } finally { clearTimeout(timer); }
}
async function fixtureId(body: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(body));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return `mock-payout-${Array.from(new Uint8Array(digest)).slice(0, 8).map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

app.get('/health', c => c.json({ service: 'payout', status: 'ok', mock: mockMode(c.env) }));

app.post('/payout', async c => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => null);
  if (!body || typeof body !== 'object') return c.json({ error: 'invalid_json' }, 400);
  if (mockMode(c.env)) return c.json({ accepted: true, status: 'queued', mock: true, messageId: await fixtureId(body) }, 202);

  const q = c.env.QSTASH_URL, t = c.env.QSTASH_TOKEN, d = c.env.CORE_BASE_URL;
  if (!q || !t || !d) return c.json({ error: 'missing_credential', credential: !q ? 'QSTASH_URL' : !t ? 'QSTASH_TOKEN' : 'CORE_BASE_URL' }, 503);
  const init: RequestInit = { method: 'POST', headers: { authorization: `Bearer ${t}`, 'content-type': 'application/json', 'upstash-retries': '3' }, body: JSON.stringify(body) };
  let r: Response | null = null;
  for (let attempt = 0; attempt < 2; attempt += 1) { try { r = await postWithTimeout(qstashUrl(q, `${d.replace(/\/$/, '')}/internal/payouts`), init); if (r.ok || attempt === 1) break; } catch { if (attempt === 1) return c.json({ error: 'queue_timeout' }, 504); } }
  if (!r?.ok) return c.json({ error: 'queue_failed' }, 502);
  const result = await r.json().catch(() => ({}));
  return c.json({ accepted: true, status: 'queued', messageId: (result as { messageId?: string }).messageId }, 202);
});

export default app;
