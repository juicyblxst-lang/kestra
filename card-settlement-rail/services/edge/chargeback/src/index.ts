import { Hono } from 'hono';
import type { Context } from 'hono';

type Env = { Bindings: { MOCK_MODE?: string; CORE_BASE_URL?: string; INTERNAL_AUTH_TOKEN?: string } };
const app = new Hono<Env>();
const mockMode = (env: Env['Bindings']) => env.MOCK_MODE === 'true';
async function forward(c: Context<Env>, path: string) {
  const body = await c.req.json<Record<string, unknown>>().catch(() => null);
  if (!body) return c.json({ error: 'invalid_json' }, 400);
  if (mockMode(c.env)) return c.json({ accepted: true, status: 'queued', mock: true, path }, 202);
  if (!c.env.CORE_BASE_URL || !c.env.INTERNAL_AUTH_TOKEN) return c.json({ error: 'missing_credential' }, 503);
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const r = await fetch(`${c.env.CORE_BASE_URL.replace(/\/$/, '')}${path}`, { method: 'POST', headers: { authorization: `Bearer ${c.env.INTERNAL_AUTH_TOKEN}`, 'content-type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal });
    return new Response(await r.text(), { status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'application/json' } });
  } catch { return c.json({ error: 'core_timeout' }, 504); } finally { clearTimeout(timer); }
}
app.get('/health', c => c.json({ service: 'chargeback', status: 'ok', mock: mockMode(c.env) }));
app.post('/chargeback', c => forward(c, '/internal/chargebacks'));
app.post('/chargeback/:id/represent', c => forward(c, `/internal/chargebacks/${encodeURIComponent(c.req.param('id'))}/represent`));
export default app;
