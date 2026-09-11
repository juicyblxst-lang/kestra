import { Hono } from 'hono';
type Env = { Bindings: { CORE_BASE_URL?: string; INTERNAL_AUTH_TOKEN?: string } };
const app = new Hono<Env>();
app.get('/health', c => c.json({ service: 'representment', status: 'ok' }));
app.post('/represent', async c => { const body=await c.req.json<Record<string,unknown>>().catch(()=>null); if(!body) return c.json({error:'invalid_json'},400); if(!c.env.CORE_BASE_URL||!c.env.INTERNAL_AUTH_TOKEN) return c.json({error:'core_not_configured'},503); const r=await fetch(`${c.env.CORE_BASE_URL.replace(/\/$/,'')}/internal/representment`,{method:'POST',headers:{authorization:`Bearer ${c.env.INTERNAL_AUTH_TOKEN}`,'content-type':'application/json'},body:JSON.stringify(body)}); return new Response(await r.text(),{status:r.status,headers:{'content-type':r.headers.get('content-type')||'application/json'}}); });
export default app;
