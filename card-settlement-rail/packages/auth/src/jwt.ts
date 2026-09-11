import { importPKCS8, importSPKI, jwtVerify, SignJWT, type JWTPayload, type JWTVerifyGetKey } from "jose";
import { isRole, type Role } from "./rbac.js";

export const INTERNAL_ALGORITHM = "HS256" as const;
export const EXTERNAL_ALGORITHM = "RS256" as const;

export type AuthRole = Role;

export interface AuthClaims extends JWTPayload {
  sub: string;
  role: AuthRole;
  roles?: AuthRole[];
}

export interface JwtSignOptions {
  issuer?: string;
  audience?: string | string[];
  expiresIn?: string;
  kid?: string;
}

function expiry(value: string | undefined): string { return value ?? "15m"; }

function validateClaims(claims: AuthClaims): void {
  if (!claims.sub || !isRole(claims.role)) throw new TypeError("JWT requires a valid sub and role");
}

export async function signInternal(claims: AuthClaims, secret: string, options: JwtSignOptions = {}): Promise<string> {
  if (secret.length < 32) throw new Error("Internal JWT secret must be at least 32 characters");
  validateClaims(claims);
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: INTERNAL_ALGORITHM, typ: "JWT", ...(options.kid ? { kid: options.kid } : {}) })
    .setIssuedAt()
    .setIssuer(options.issuer ?? "card-settlement-rail")
    .setAudience(options.audience ?? "card-settlement-rail")
    .setExpirationTime(expiry(options.expiresIn))
    .sign(new TextEncoder().encode(secret));
}

export async function verifyInternal(token: string, secrets: string | Record<string, string>, options: { issuer?: string; audience?: string | string[] } = {}): Promise<AuthClaims> {
  const key: JWTVerifyGetKey = async (protectedHeader) => {
    const secret = typeof secrets === "string" ? secrets : (protectedHeader.kid ? secrets[protectedHeader.kid] : undefined);
    if (!secret || secret.length < 32) throw new Error("Unknown or invalid JWT signing key");
    return new TextEncoder().encode(secret);
  };
  const { payload } = await jwtVerify(token, key, {
    algorithms: [INTERNAL_ALGORITHM],
    issuer: options.issuer ?? "card-settlement-rail",
    audience: options.audience ?? "card-settlement-rail",
  });
  if (typeof payload.sub !== "string" || !isRole(payload.role)) throw new Error("Invalid auth claims");
  return { ...payload, sub: payload.sub, role: payload.role };
}

export async function signExternal(claims: AuthClaims, privateKeyPem: string, options: JwtSignOptions = {}): Promise<string> {
  validateClaims(claims);
  const key = await importPKCS8(privateKeyPem, EXTERNAL_ALGORITHM);
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: EXTERNAL_ALGORITHM, typ: "JWT", ...(options.kid ? { kid: options.kid } : {}) })
    .setIssuedAt()
    .setIssuer(options.issuer ?? "external-identity")
    .setAudience(options.audience ?? "card-settlement-rail")
    .setExpirationTime(expiry(options.expiresIn))
    .sign(key);
}

export async function verifyExternal(token: string, publicKeys: string | Record<string, string>, options: { issuer?: string; audience?: string | string[] } = {}): Promise<AuthClaims> {
  const key: JWTVerifyGetKey = async (protectedHeader) => {
    const pem = typeof publicKeys === "string" ? publicKeys : (protectedHeader.kid ? publicKeys[protectedHeader.kid] : undefined);
    if (!pem) throw new Error("Unknown or missing external JWT key id");
    return importSPKI(pem, EXTERNAL_ALGORITHM);
  };
  const { payload } = await jwtVerify(token, key, {
    algorithms: [EXTERNAL_ALGORITHM],
    issuer: options.issuer ?? "external-identity",
    audience: options.audience ?? "card-settlement-rail",
  });
  if (typeof payload.sub !== "string" || !isRole(payload.role)) throw new Error("Invalid auth claims");
  return { ...payload, sub: payload.sub, role: payload.role };
}
