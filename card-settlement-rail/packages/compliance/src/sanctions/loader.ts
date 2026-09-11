import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export interface SanctionsEntity {
  id: string;
  name: string;
  dob?: string;
  country?: string;
  list: string;
}

export interface SanctionsIndex {
  entities: readonly SanctionsEntity[];
  byCountry: ReadonlyMap<string, readonly SanctionsEntity[]>;
  byFirstLetter: ReadonlyMap<string, readonly SanctionsEntity[]>;
}

const fixtureUrl = new URL("../../fixtures/sanctions-mini.json", import.meta.url);

function normalize(value: string): string {
  return value.trim().toUpperCase();
}

function parseEntities(raw: unknown): SanctionsEntity[] {
  if (!Array.isArray(raw)) throw new Error("Sanctions fixture must be an array");
  return raw.map((value, index) => {
    if (!value || typeof value !== "object") throw new Error(`Invalid sanctions entity at index ${index}`);
    const item = value as Record<string, unknown>;
    if (typeof item.id !== "string" || typeof item.name !== "string" || typeof item.list !== "string") {
      throw new Error(`Invalid sanctions entity fields at index ${index}`);
    }
    return {
      id: item.id,
      name: normalize(item.name),
      dob: typeof item.dob === "string" ? item.dob : undefined,
      country: typeof item.country === "string" ? normalize(item.country) : undefined,
      list: item.list,
    };
  });
}

export function loadSanctionsFixture(path = fileURLToPath(fixtureUrl)): SanctionsIndex {
  const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
  const entities = parseEntities(parsed);
  const byCountry = new Map<string, SanctionsEntity[]>();
  const byFirstLetter = new Map<string, SanctionsEntity[]>();

  for (const entity of entities) {
    const country = entity.country ?? "UNKNOWN";
    const letter = entity.name[0] ?? "#";
    byCountry.set(country, [...(byCountry.get(country) ?? []), entity]);
    byFirstLetter.set(letter, [...(byFirstLetter.get(letter) ?? []), entity]);
  }

  return { entities, byCountry, byFirstLetter };
}

export const sanctionsIndex = loadSanctionsFixture();
