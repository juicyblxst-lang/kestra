# Disaster Recovery Runbook

## Objectives
Protect ledger integrity first, then restore availability. Define and test RPO/RTO targets with the business and compliance owners before production.

## Recovery sequence
1. Declare the incident and establish an incident commander.
2. Protect credentials and isolate compromised infrastructure if applicable.
3. Determine the last known consistent database state and backup.
4. Restore Postgres into an isolated recovery environment and verify checksums, constraints, ledger balances, and audit records.
5. Restore Redis only as a disposable acceleration layer; durable financial state remains authoritative in Postgres.
6. Restore core services and validate migrations/schema compatibility.
7. Reconcile transactions, clearing files, settlement batches, and external confirmations before releasing new money movement.
8. Restore edge traffic gradually and monitor for drift.

## Recovery tests
At least quarterly in production: perform a documented restore exercise, measure RPO/RTO, verify ledger invariants, and record evidence. Test credential rotation and emergency access separately.

## Data integrity rule
Never declare recovery successful solely because HTTP health checks pass. Financial reconciliation and audit continuity are release gates.
