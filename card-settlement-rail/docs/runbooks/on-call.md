# On-Call Runbook

## Priorities
1. Protect customer/merchant funds and ledger integrity.
2. Contain security or compliance exposure.
3. Restore service safely.
4. Preserve evidence and communicate impact.

## First response
- Acknowledge the alert and assign an incident commander for material incidents.
- Check core health, error rate, latency, queue depth, settlement failures, and reconciliation drift.
- Identify affected transaction IDs without placing PAN, CVV, credentials, or unnecessary PII in notes.
- Determine whether new settlement execution should be paused.

## Escalation
Escalate immediately for suspected duplicate/missing settlement, ledger imbalance, unauthorized access, sanctions-control failure, material data exposure, or inability to reconcile external funds.

## Closure
Do not close a material incident until monitoring is stable, financial reconciliation is complete, customer/compliance notifications are addressed where required, and the incident record contains a timeline and corrective actions.
