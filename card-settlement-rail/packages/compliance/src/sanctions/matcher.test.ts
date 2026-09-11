import { describe, expect, it } from "vitest";
import { loadSanctionsFixture } from "./loader.js";
import { jaroWinkler, screenSubject } from "./matcher.js";

const index = loadSanctionsFixture();

describe("sanctions matcher", () => {
  it("detects an exact known hit", () => {
    const result = screenSubject({ name: "Alexei Ivanov", dob: "1974-03-12", country: "RU" }, index);
    expect(result.hit).toBe(true);
    expect(result.entity?.id).toBe("OFAC-001");
    expect(result.list).toBe("OFAC-SDN");
    expect(result.score).toBeGreaterThanOrEqual(0.92);
  });

  it("detects a realistic name formatting variation", () => {
    const result = screenSubject({ name: "Sergei  Petrov", dob: "1982-05-09", country: "RU" }, index);
    expect(result.hit).toBe(true);
    expect(result.entity?.id).toBe("EU-007");
  });

  it("does not match a similar name in a different country", () => {
    const result = screenSubject({ name: "Alexei Ivanov", dob: "1974-03-12", country: "UA" }, index);
    expect(result.hit).toBe(false);
    expect(result.entity).toBeNull();
  });

  it("does not create a false positive from a similar name and wrong DOB", () => {
    const result = screenSubject({ name: "Alexei Ivanov", dob: "1994-03-12", country: "RU" }, index);
    expect(result.hit).toBe(false);
  });

  it("handles empty and one-character names safely", () => {
    expect(jaroWinkler("", "A")).toBe(0);
    expect(jaroWinkler("A", "A")).toBe(1);
    expect(screenSubject({ name: "", country: "RU" }, index).hit).toBe(false);
  });

  it("normalizes punctuation and case", () => {
    expect(jaroWinkler("KARIM-BEN SALEM", "karim ben salem")).toBe(1);
  });

  it("loads and indexes all static entities", () => {
    expect(index.entities).toHaveLength(20);
    expect(index.byCountry.get("NG")?.length).toBe(3);
    expect(index.byFirstLetter.get("A")?.length).toBeGreaterThan(0);
  });
});
