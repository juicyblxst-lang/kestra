import type { FastifyReply, FastifyRequest } from "fastify";
import { createMiddleware } from "hono/factory";
import type { Context } from "hono";
import { verifyExternal, verifyInternal, type AuthClaims } from "./jwt.js";
import { authorize, type Action, type Resource } from "./policy.js";
import { isRole, type Role } from "./rbac.js";

export interface AuthVerifierOptions {
  internalSecrets?: string | Record<string, string>;
  externalPublicKeys?: string | Record<string, string>;
  issuer?: string;
  audience?: string | string[];
}

export async function verifyBearer(token: string, options: AuthVerifierOptions): Promise<AuthClaims> {
  if (options.internalSecrets) {
    try { return await verifyInternal(token, options.internalSecrets, { issuer: options.issuer, audience: options.audience }); } catch { /* external token path */ }
  }
  if (options.externalPublicKeys) return verifyExternal(token, options.externalPublicKeys, { issuer: options.issuer, audience: options.audience });
  throw new Error("No JWT verification keys configured");
}

function bearer(request: { headers: { authorization?: string } }): string {
  const value = request.headers.authorization;
  if (!value?.startsWith("Bearer ")) throw new Error("Missing bearer token");
  return value.slice(7);
}

export function createHonoAuthMiddleware(options: AuthVerifierOptions) {
  return createMiddleware<{ Variables: { auth: AuthClaims } }>(async (c, next) => {
    try {
      const claims = await verifyBearer(bearer({ headers: { authorization: c.req.header("authorization") } }), options);
      c.set("auth", claims);
      await next();
    } catch {
      return c.json({ error: "Unauthorized" }, 401);
    }
  });
}

export function createHonoAuthorizationMiddleware(action: Action, resource: Resource) {
  return createMiddleware<{ Variables: { auth: AuthClaims } }>(async (c: Context<{ Variables: { auth: AuthClaims } }>, next) => {
    const claims = c.get("auth");
    if (!claims || !isRole(claims.role)) return c.json({ error: "Unauthorized" }, 401);
    try { authorize(claims.role, action, resource); await next(); }
    catch { return c.json({ error: "Forbidden" }, 403); }
  });
}

export function createFastifyAuthPreHandler(options: AuthVerifierOptions) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try { request.auth = await verifyBearer(bearer(request), options); }
    catch { await reply.code(401).send({ error: "Unauthorized" }); }
  };
}

export function createFastifyAuthorizationPreHandler(action: Action, resource: Resource) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const claims = request.auth;
    if (!claims || !isRole(claims.role)) { await reply.code(401).send({ error: "Unauthorized" }); return; }
    try { authorize(claims.role as Role, action, resource); }
    catch { await reply.code(403).send({ error: "Forbidden" }); }
  };
}

declare module "fastify" { interface FastifyRequest { auth?: AuthClaims } }
