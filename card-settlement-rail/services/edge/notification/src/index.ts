import { Hono } from 'hono';

type Env = { Bindings: { MOCK_MODE?: string; RESEND_API_KEY?: string; RESEND_FROM?: string; EXPO_ACCESS_TOKEN?: string } };
const app = new Hono<Env>();
const mockMode = (env: Env['Bindings']) => env.MOCK_MODE === 'true';
async function postWithTimeout(url: string, init: RequestInit, timeoutMs = 5000) { const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeoutMs); try { return await fetch(url, { ...init, signal: controller.signal }); } finally { clearTimeout(timer); } }
app.get('/health', c => c.json({ service: 'notification', status: 'ok', mock: mockMode(c.env) }));
app.post('/email', async c => {
  const b = await c.req.json<{ to: string; subject: string; html: string }>().catch(() => null); if (!b?.to || !b.subject || !b.html) return c.json({ error: 'invalid_request' }, 400);
  if (mockMode(c.env)) return c.json({ queued: true, provider: 'resend', mock: true, messageId: 'mock-email-0001' }, 202);
  if (!c.env.RESEND_API_KEY || !c.env.RESEND_FROM) return c.json({ error: 'missing_credential', credential: !c.env.RESEND_API_KEY ? 'RESEND_API_KEY' : 'RESEND_FROM' }, 503);
  try { const r = await postWithTimeout('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${c.env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify({ from: c.env.RESEND_FROM, to: [b.to], subject: b.subject, html: b.html }) }); return new Response(await r.text(), { status: r.status, headers: { 'content-type': 'application/json' } }); } catch { return c.json({ error: 'provider_timeout' }, 504); }
});
app.post('/push', async c => {
  const b = await c.req.json<{ to: string; title: string; body: string; data?: Record<string, unknown> }>().catch(() => null); if (!b?.to || !b.title || !b.body) return c.json({ error: 'invalid_request' }, 400);
  if (mockMode(c.env)) return c.json({ queued: true, provider: 'expo', mock: true, messageId: 'mock-push-0001' }, 202);
  if (!c.env.EXPO_ACCESS_TOKEN) return c.json({ error: 'missing_credential', credential: 'EXPO_ACCESS_TOKEN' }, 503);
  try { const r = await postWithTimeout('https://exp.host/--/api/v2/push/send', { method: 'POST', headers: { authorization: `Bearer ${c.env.EXPO_ACCESS_TOKEN}`, 'content-type': 'application/json' }, body: JSON.stringify({ to: b.to, title: b.title, body: b.body, data: b.data }) }); return new Response(await r.text(), { status: r.status, headers: { 'content-type': 'application/json' } }); } catch { return c.json({ error: 'provider_timeout' }, 504); }
});
export default app;
