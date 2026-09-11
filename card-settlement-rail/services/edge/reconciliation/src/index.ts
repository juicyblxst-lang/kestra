import { Hono } from 'hono';
type Env = { Bindings: { SUPABASE_URL?: string; SUPABASE_SERVICE_KEY?: string } };
const app = new Hono<Env>();
app.get('/health', c => c.json({ service: 'reconciliation', status: 'ok' }));
app.get('/reconcile/:date', async c => {
  const date = c.req.param('date');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return c.json({ error: 'invalid_date' }, 400);
  const base = c.env.SUPABASE_URL; const key = c.env.SUPABASE_SERVICE_KEY;
  if (!base || !key) return c.json({ error: 'supabase_not_configured' }, 503);
  const url = new URL('/rest/v1/reconciliation', base); url.searchParams.set('select','*'); url.searchParams.set('date',`eq.${date}`);
  const response = await fetch(url, { headers: { apikey: key, authorization: `Bearer ${key}` } });
  if (!response.ok) return c.json({ error: 'reconciliation_read_failed' }, 502);
  return c.json({ date, records: await response.json() });
});
export default app;
