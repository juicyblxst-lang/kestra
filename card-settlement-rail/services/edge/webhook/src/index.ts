import { Hono } from 'hono';

type Env = { Bindings: {
  MOCK_MODE?: string;
  QSTASH_URL?: string;
  QSTASH_TOKEN?: string;
  WEBHOOK_SIGNING_KEY?: string;
  WEBHOOK_SECRET?: string;
} };

const app = new Hono<Env>();

function mockMode(env: Env['Bindings']): boolean {
  return env.MOCK_MODE === undefined || env.MOCK_MODE === 'true';
}

function qstashUrl(base: string, destination: string) {
  const b = base.replace(/\/$/, '');
  if (b.includes('{destination}')) return b.replace('{destination}', destination);
  if (/\/publish$/.test(b)) return `${b}/${destination}`;
  return `${b}/v2/publish/${destination}`;
}

async function sign(secret: string, payload: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const b = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return 'sha256=' + Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
}

app.get('/health', c => c.json({ service: 'webhook', status: 'ok', mock: mockMode(c.env) }));

app.post('/deliver', async c => {
  const b = await c.req.json<{ url: string; event: string; payload: unknown }>().catch(() => null);
  if (!b?.url || !b.event || b.payload === undefined) return c.json({ error: 'invalid_request' }, 400);

  if (mockMode(c.env)) {
    const body = JSON.stringify(b.payload);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body));
    return c.json({ delivered: true, queued: false, mock: true, payloadHash: Array.from(new Uint8Array(digest)).map(x => x.toString(16).padStart(2, '0')).join('') }, 200);
  }

  const secret = c.env.WEBHOOK_SIGNING_KEY ?? c.env.WEBHOOK_SECRET;
  if (!secret) return c.json({ error: 'missing_credential', credential: 'WEBHOOK_SIGNING_KEY' }, 503);

  const body = JSON.stringify(b.payload);
  const sig = await sign(secret, body);
  const headers = { 'content-type': 'application/json', 'x-card-settlement-event': b.event, 'x-card-settlement-signature': sig };
  const r = await fetch(b.url, { method: 'POST', headers, body });
  if (r.ok) return c.json({ delivered: true }, 200);
  if (!c.env.QSTASH_URL || !c.env.QSTASH_TOKEN) return c.json({ delivered: false, queued: false }, 502);
  const qr = await fetch(qstashUrl(c.env.QSTASH_URL, b.url), {
    method: 'POST',
    headers: {
      authorization: `Bearer ${c.env.QSTASH_TOKEN}`,
      'content-type': 'application/json',
      'upstash-retries': '3',
      'upstash-forward-x-card-settlement-event': b.event,
      'upstash-forward-x-card-settlement-signature': sig,
    },
  }).catch(() => null);
  if (!qr?.ok) return c.json({ delivered: false, queued: false }, 502);
  return c.json({ delivered: false, queued: true }, 202);
});

export default app;
