const encoder=new TextEncoder();
function hex(bytes:ArrayBuffer){return Array.from(new Uint8Array(bytes)).map(b=>b.toString(16).padStart(2,'0')).join('');}
async function digest(secret:string,payload:string){const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',key,encoder.encode(payload)));}
export async function verifyWebhookSignature(payload:string,signature:string,secret:string):Promise<boolean>{const expected=await digest(secret,payload);const supplied=signature.replace(/^sha256=/,'').toLowerCase();if(supplied.length!==expected.length)return false;let diff=0;for(let i=0;i<expected.length;i++)diff|=expected.charCodeAt(i)^supplied.charCodeAt(i);return diff===0;}
export async function signWebhookPayload(payload:string,secret:string):Promise<string>{return `sha256=${await digest(secret,payload)}`;}
