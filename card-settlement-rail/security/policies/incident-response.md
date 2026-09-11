# Security Incident Response Policy

## Objectives
Protect customers and funds, contain compromise, preserve evidence, restore trusted operation, and meet contractual/regulatory notification obligations.

## Severity
- **SEV-1:** suspected loss/control of funds, settlement signer compromise, material PII breach, or systemic authorization bypass.
- **SEV-2:** material security degradation with contained financial impact.
- **SEV-3:** localized security issue without material customer/funds impact.

## Procedure
1. Declare incident and assign incident commander.
2. Freeze affected privileged actions; pause settlement if integrity is uncertain.
3. Preserve logs, audit records, deployment metadata, transaction hashes, and relevant artifacts.
4. Rotate/revoke compromised credentials and keys through the approved secret-management path.
5. Scope affected accounts, transactions, data, and infrastructure.
6. Patch only after evidence is preserved and the containment plan is approved.
7. Reconcile ledger/database/on-chain state before resuming settlement.
8. Notify customers, partners, regulators, or law enforcement when required.
9. Complete post-incident review and track corrective actions to closure.

Never delete evidence or overwrite audit records during an incident.
