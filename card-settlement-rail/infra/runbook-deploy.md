# Deployment Runbook

Round 1 is configuration-only. Do not deploy until the production release gate is approved.

## Pre-flight
1. Confirm the release commit and reviewed change set.
2. Confirm environment-specific secrets exist in the runtime secret manager; never put them in Git.
3. Confirm database backup/restore status and pending migrations.
4. Confirm monitoring, alerting, audit logging, and rollback target.
5. Confirm contract addresses/network and operator credentials match the intended environment.
6. Run the full local validation suite before invoking a deployment workflow.

## Core release
The primary runtime is Fly.io. Deploy the reviewed image/configuration, wait for health checks, then validate `/health`, database connectivity, queue connectivity, and read-only application paths before enabling money movement.

## Edge release
Deploy Cloudflare Workers only after verifying the Worker bindings and production environment values. Validate `/health` and a controlled screening request.

## Post-deploy
Monitor error rate, latency, queue depth, settlement failures, reconciliation drift, and audit events. Keep the previous known-good release available for immediate rollback.

## Safety
Never test production settlement with arbitrary funds. Production smoke tests must use approved test transactions and reconciliation checks.
