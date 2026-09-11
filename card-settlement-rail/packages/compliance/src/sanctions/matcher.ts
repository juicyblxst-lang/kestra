import type { SanctionsEntity, SanctionsIndex } from "./loader.js";

export interface ScreeningSubject {
  name: string;
  dob?: string;
  country?: string;
}

export interface SanctionsMatch {
  hit: boolean;
  score: number;
  list: string | null;
  entity: SanctionsEntity | null;
}

const DEFAULT_THRESHOLD = 0.92;

function normalize(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function jaroWinkler(left: string, right: string): number {
  const a = normalize(left);
  const b = normalize(right);
  if (a === b) return 1;
  if (!a || !b) return 0;

  const distance = Math.max(0, Math.floor(Math.max(a.length, b.length) / 2) - 1);
  const aMatches = new Array<boolean>(a.length).fill(false);
  const bMatches = new Array<boolean>(b.length).fill(false);
  let matches = 0;

  for (let i = 0; i < a.length; i++) {
    for (let j = Math.max(0, i - distance); j <= Math.min(i + distance, b.length - 1); j++) {
      if (bMatches[j] || a[i] !== b[j]) continue;
      aMatches[i] = true;
      bMatches[j] = true;
      matches++;
      break;
    }
  }
  if (matches === 0) return 0;

  const aChars = a.split("").filter((_, i) => aMatches[i]);
  const bChars = b.split("").filter((_, i) => bMatches[i]);
  let transpositions = 0;
  for (let i = 0; i < aChars.length; i++) if (aChars[i] !== bChars[i]) transpositions++;

  const jaro = (matches / a.length + matches / b.length + (matches - transpositions / 2) / matches) / 3;
  let prefix = 0;
  while (prefix < 4 && prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) prefix++;
  return jaro > 0.7 ? jaro + prefix * 0.1 * (1 - jaro) : jaro;
}

function blockedCandidates(subject: ScreeningSubject, index: SanctionsIndex): SanctionsEntity[] {
  const country = subject.country?.trim().toUpperCase();
  const firstLetter = normalize(subject.name)[0];
  const countryCandidates = country ? [...(index.byCountry.get(country) ?? [])] : [...index.entities];
  const letterCandidates = firstLetter ? index.byFirstLetter.get(firstLetter) ?? [] : index.entities;
  const letterIds = new Set(letterCandidates.map((entity) => entity.id));
  const blocked = countryCandidates.filter((entity) => letterIds.has(entity.id));
  if (subject.dob) {
    const dobCandidates = blocked.filter((entity) => entity.dob === subject.dob);
    if (dobCandidates.length) return dobCandidates;
  }
  return blocked;
}

export function screenSubject(subject: ScreeningSubject, index: SanctionsIndex, threshold = DEFAULT_THRESHOLD): SanctionsMatch {
  const candidates = blockedCandidates(subject, index);
  let best: { entity: SanctionsEntity; score: number } | null = null;

  for (const entity of candidates) {
    const nameScore = jaroWinkler(subject.name, entity.name);
    const dobScore = subject.dob && entity.dob ? (subject.dob === entity.dob ? 1 : 0) : 0.5;
    const countryScore = subject.country && entity.country ? (subject.country.toUpperCase() === entity.country ? 1 : 0) : 0.5;
    const score = nameScore * 0.7 + dobScore * 0.2 + countryScore * 0.1;
    if (!best || score > best.score) best = { entity, score };
  }

  const hit = Boolean(best && best.score >= threshold);
  return { hit, score: best?.score ?? 0, list: hit ? best!.entity.list : null, entity: hit ? best!.entity : null };
}
