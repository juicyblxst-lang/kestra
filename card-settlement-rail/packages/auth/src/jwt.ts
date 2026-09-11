import { importPKCS8, importSPKI, jwtVerify, SignJWT, type JWTPayload } from "jose";

export const INTERNAL_ALGORITHM = "HS256" as const;
export const EXTERNAL_ALGORITHM = "RS256" as const;

export type AuthRole = "acquirer" | "issuer" | "network_ops" | "merchant" | "compliance" | "admin";

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

function expiry(value: string | undefined): string {
  return value ?? "15m";
}

function validateClaims(claims: AuthClaims): void {
  if (!claims.sub || !claims.role) throw new TypeError("JWT requires sub and role");
}

export async function signInternal(
  claims: AuthClaims,
  secret: string,
  options: JwtSignOptions = {},
): Promise<string> {
  if (secret.length < 32) throw new Error("Internal JWT secret must be at least 32 characters");
  validateClaims(claims);
  const key = new TextEncoder().encode(secret);
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: INTERNAL_ALGORITHM, typ: "JWT", ...(options.kid ? { kid: options.kid } : {}) })
    .setIssuedAt()
    .setIssuer(options.issuer ?? "card-settlement-rail")
    .setAudience(options.audience ?? "card-settlement-rail")
    .setExpirationTime(expiry(options.expiresIn))
    .sign(key);
}

export async function verifyInternal(
  token: string,
  secrets: string | Record<string, string>,
  options: { issuer?: string; audience?: string | string[] } = {},
): Promise<AuthClaims> {
  const secretsByKid = typeof secrets === "string" ? undefined : secrets;
  const key = async (protectedHeader: { kid?: string }) => {
    const secret = secretsByKid
      ? protectedHeader.kid ? secretsByKid[protectedHeader.kid] : undefined
      : secrets;
    if (!secret) throw new Error("Unknown or missing JWT key id");
    return new TextEncoder().encode(secret);
  };
  const { payload, protectedHeader } = await jwtVerify(token, key, {
    algorithms: [INTERNAL_ALGORITHM],
    issuer: options.issuer ?? "card-settlement-rail",
    audience: options.audience ?? "card-settlement-rail",
  });
  if (typeof payload.sub !== "string" || typeof payload.role !== "string") throw new Error("Invalid auth claims");
  return { ...payload, sub: payload.sub, role: payload.role as AuthRole, ...(protectedHeader.kid ? {} : {}) };
}

export async function signExternal(
  claims: AuthClaims,
  privateKeyPem: string,
  options: JwtSignOptions = {},
): Promise<string> {
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

export async function verifyExternal(
  token: string,
  publicKeys: string | Record<string, string>,
  options: { issuer?: string; audience?: string | string[] } = {},
): Promise<AuthClaims> {
  const keysByKid = typeof publicKeys === "string" ? undefined : publicKeys;
  const key = async (protectedHeader: { kid?: string }) => {
    const pem = keysByKid
      ? protectedHeader.kid ? keysByKid[protectedHeader.kid] : undefined
      : publicKeys;
    if (!pem) throw new Error("Unknown or missing external JWT key id");
    return importSPKI(pem, EXTERNAL_ALGORITHM);
  };
  const { payload } = await jwtVerify(token, key, {
    algorithms: [EXTERNAL_ALGORITHM],
    issuer: options.issuer ?? "external-identity",
    audience: options.audience ?? "card-settlement-rail",
  });
  if (typeof payload.sub !== "string" || typeof payload.role !== "string") throw new Error("Invalid auth claims");
  return { ...payload, sub: payload.sub, role: payload.role as AuthRole };
}
