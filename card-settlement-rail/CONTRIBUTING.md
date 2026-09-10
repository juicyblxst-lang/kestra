# Contributing

## Development
Use Node.js 22 and pnpm 9. Install dependencies with `pnpm install`, then run `pnpm test`.

## Commits
Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `ci:`, or `security:` as appropriate.

## Branches
Use descriptive branches: `feat/<scope>`, `fix/<scope>`, `refactor/<scope>`, `test/<scope>`, or `chore/<scope>`.

## Financial code
Money is represented as bigint minor units. Never use floating-point arithmetic for monetary values. Domain operations return `Result` rather than throwing. Changes to settlement, ledger, compliance, or authorization behavior require focused tests and explicit review.
