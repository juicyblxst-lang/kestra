import { describe, expect, it } from "vitest";
import { assertCanAssumeRole, canAssumeRole, isRole } from "./rbac.js";

describe("RBAC", () => {
  it("accepts only defined roles", () => {
    expect(isRole("admin")).toBe(true);
    expect(isRole("superuser")).toBe(false);
  });
  it("blocks horizontal and upward role escalation", () => {
    expect(canAssumeRole("merchant", "admin")).toBe(false);
    expect(canAssumeRole("merchant", "acquirer")).toBe(false);
    expect(() => assertCanAssumeRole("merchant", "admin")).toThrow(/Role escalation denied/);
  });
  it("allows admin delegation", () => expect(canAssumeRole("admin", "compliance")).toBe(true));
});
