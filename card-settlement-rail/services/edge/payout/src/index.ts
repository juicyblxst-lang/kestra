import { Hono } from 'hono';
type Env={Bindings:{QSTASH_URL?:string;QSTASH_TOKEN?:string;CORE_BASE_URL?:string}};
const app=new Hono<Env>();
function qstashUrl(base:string,destination:string){const b=base.replace(/\/$/,'');if(b.includes('{destination}'))return b.replace('{destination}',destination);if(/\/publish$/.test(b))return `${b}/${destination}`;return `${b}/v2/publish/${destination}`;}
app.get('/health',c=>c.json({service:'payout',status:'ok'}));
app.post('/payout',async c=>{const body=await c.req.json<Record<string,unknown>>().catch(()=>null);if(!body||typeof body!=='object')return c.json({error:'invalid_json'},400);const q=c.env.QSTASH_URL,t=c.env.QSTASH_TOKEN,d=c.env.CORE_BASE_URL;if(!q||!t||!d)return c.json({error:'queue_not_configured'},503);const r=await fetch(qstashUrl(q,`${d.replace(/\/$/,'')}/internal/payouts`),{method:'POST',headers:{authorization:`Bearer ${t}`,'content-type':'application/json','upstash-retries':'3'},body:JSON.stringify(body)});if(!r.ok)return c.json({error:'queue_failed'},502);const result=await r.json().catch(()=>({}));return c.json({accepted:true,status:'queued',messageId:(result as {messageId?:string}).messageId},202);});
export default app;
