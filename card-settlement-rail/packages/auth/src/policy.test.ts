import { describe, expect, it } from "vitest";
import { authorize, defineAbilityFor } from "./policy.js";

describe("policy", () => {
  it("permits merchant transaction creation but not settlement", () => {
    expect(defineAbilityFor("merchant").can("create", "transaction")).toBe(true);
    expect(defineAbilityFor("merchant").can("settle", "settlement")).toBe(false);
    expect(() => authorize("merchant", "settle", "settlement")).toThrow(/Forbidden/);
  });
  it("keeps compliance read/screen oriented", () => {
    expect(defineAbilityFor("compliance").can("screen", "compliance")).toBe(true);
    expect(defineAbilityFor("compliance").can("settle", "settlement")).toBe(false);
  });
});
