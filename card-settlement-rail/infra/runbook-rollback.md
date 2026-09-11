# Rollback Runbook

## Trigger conditions
Rollback when a release causes material correctness, availability, security, compliance, or settlement-risk degradation. Preserve evidence before changing state.

## Procedure
1. Declare the incident and assign an incident commander.
2. Freeze non-essential deployments and, where necessary, pause new settlement execution.
3. Capture current release ID, logs, metrics, queue state, and affected transaction IDs.
4. Revert core/edge services to the last known-good immutable release.
5. Confirm health checks and read-only paths.
6. Reconcile in-flight jobs and ledger state before resuming settlement.
7. Validate no duplicate or missing settlement was introduced.
8. Resume traffic progressively with heightened monitoring.

## Database caution
Application rollback does not automatically imply database rollback. Migrations must be designed for compatibility and, where possible, expand/contract semantics. Never destroy financial records to recover application availability.

## Aftercare
Document timeline, customer/merchant impact, financial exposure, root cause, corrective action, and evidence retention requirements.
