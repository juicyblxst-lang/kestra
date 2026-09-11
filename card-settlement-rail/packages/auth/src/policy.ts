import { AbilityBuilder, createMongoAbility, type MongoAbility } from "@casl/ability";
import type { Role } from "./rbac.js";

export type Action = "read" | "create" | "update" | "delete" | "approve" | "settle" | "screen";
export type Resource = "account" | "transaction" | "ledger" | "settlement" | "chargeback" | "compliance" | "config" | "audit";

export type AppAbility = MongoAbility<[Action, Resource]>;

export function defineAbilityFor(role: Role): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  switch (role) {
    case "merchant":
      can("read", "account"); can("read", "transaction"); can("create", "transaction");
      can("read", "chargeback"); can("create", "chargeback");
      break;
    case "acquirer":
      can("read", "account"); can("read", "transaction"); can("create", "transaction");
      can("read", "settlement"); can("settle", "settlement"); can("read", "chargeback");
      break;
    case "issuer":
      can("read", "account"); can("read", "transaction"); can("approve", "transaction");
      can("read", "settlement"); can("read", "chargeback");
      break;
    case "network_ops":
      can("read", "account"); can("read", "transaction"); can("read", "ledger");
      can("read", "settlement"); can("settle", "settlement"); can("read", "audit");
      can("update", "config");
      break;
    case "compliance":
      can("read", "account"); can("read", "transaction"); can("read", "audit");
      can("screen", "compliance"); can("approve", "compliance"); can("read", "chargeback");
      cannot("settle", "settlement");
      break;
    case "admin":
      can("manage" as Action, "all" as Resource);
      break;
  }
  return build({ detectSubjectType: (subject) => (typeof subject === "string" ? subject : (subject as { type: Resource }).type) }) as AppAbility;
}

export function authorize(role: Role, action: Action, resource: Resource): void {
  if (!defineAbilityFor(role).can(action, resource)) throw new Error(`Forbidden: ${role} cannot ${action} ${resource}`);
}
