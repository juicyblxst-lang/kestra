# Sanctions Screening

Round 1 uses only the checked-in `packages/compliance/fixtures/sanctions-mini.json`. No live sanctions list is downloaded or queried.

## Screening pipeline
1. Normalize the subject name, country, and optional date of birth.
2. Block candidates by country and first name letter.
3. Prefer candidates with an exact date-of-birth match when DOB is supplied.
4. Score candidate names with Jaro-Winkler and combine name, DOB, and country signals.
5. Return the highest-scoring entity only when the configured threshold is met.

The API response contains `hit`, `score`, `list`, and the matched entity. A non-hit must not be interpreted as proof that a person is not sanctioned.

## Production requirements
- Replace the static fixture with an approved, versioned data-provider ingestion pipeline.
- Record source, list version, retrieval time, and screening decision metadata.
- Support aliases, transliteration, fuzzy matching, date-of-birth tolerance, entity types, and list-specific semantics.
- Route material matches to a documented review workflow before blocking/releasing funds.
- Re-screen customers and relevant transactions when lists change.

The Round 1 worker intentionally has no sanctions-data secret or live-provider integration.
