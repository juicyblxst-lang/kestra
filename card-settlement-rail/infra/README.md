# Infrastructure Map

## Primary topology
- `services/core/` — primary transactional API and settlement worker; Fly.io is the primary runtime target.
- `services/edge/` — Cloudflare Worker edge APIs for sanctions/AML.
- `packages/config/` — typed environment and feature-flag contracts shared by services.
- `packages/observability/` — logging, metrics, tracing, and error-reporting primitives.
- `packages/domain/` — financial domain primitives shared across services.
- `.github/workflows/` — CI/CD, migration, security, and operational automation definitions. Round 1 is manual-only.
- `infra/` — operational architecture, budget, deployment, rollback, and disaster-recovery runbooks.

## Cost implications
The architecture deliberately separates low-latency edge workloads from stateful transactional infrastructure. Cloudflare Workers can absorb lightweight request handling without maintaining application servers at the edge. Fly.io core capacity is the main always-on compute cost; Postgres and Redis introduce stateful-service costs; observability volume can become material as request, trace, and audit volume grows.

Round 1 contains no production deployment or paid-provider usage. Vendor selection, committed spend, and autoscaling limits must be reviewed before production activation.

## Infrastructure principles
- No secrets are committed to the repository.
- Production money movement must be isolated from non-production credentials and networks.
- Database backups and restoration must be tested, not merely configured.
- Settlement, reconciliation, and ledger operations must remain observable and auditable.
