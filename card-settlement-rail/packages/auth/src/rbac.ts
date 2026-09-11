import type { AuthRole } from "./jwt.js";

export const ROLES = ["acquirer", "issuer", "network_ops", "merchant", "compliance", "admin"] as const;
export type Role = (typeof ROLES)[number];

const ROLE_RANK: Record<Role, number> = {
  merchant: 10,
  acquirer: 20,
  issuer: 20,
  network_ops: 30,
  compliance: 40,
  admin: 50,
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function assertRole(value: unknown): asserts value is Role {
  if (!isRole(value)) throw new Error("Invalid role");
}

export function canAssumeRole(actor: Role, target: Role): boolean {
  return actor === "admin" || actor === target;
}

export function roleRank(role: AuthRole): number {
  assertRole(role);
  return ROLE_RANK[role];
}

export function hasRole(roles: readonly Role[], required: Role): boolean {
  return roles.includes(required) || roles.includes("admin");
}

export function assertCanAssumeRole(actor: Role, target: Role): void {
  if (!canAssumeRole(actor, target)) throw new Error(`Role escalation denied: ${actor} cannot assume ${target}`);
}
