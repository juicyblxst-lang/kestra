# Incident Response

## Severity guidance
- **SEV-1:** confirmed or likely loss/corruption of funds, systemic security compromise, or broad service failure.
- **SEV-2:** material degradation, settlement delays, reconciliation failure, or significant compliance-control impairment.
- **SEV-3:** localized issue with a documented workaround and no material financial exposure.

## Incident record
Capture start/end times, detection source, responders, affected services, transaction/batch identifiers, customer impact, containment actions, evidence links, and decisions. Do not record secrets, raw PAN, CVV, or unnecessary PII.

## Command structure
The incident commander owns coordination and release decisions. Engineering owns technical containment/recovery. Compliance/security owns regulatory and security assessment. Support/operations owns customer and merchant communications.

## Financial incident gate
If ledger integrity, settlement duplication, missing funds, or reconciliation is uncertain, pause the affected money movement path until an authoritative reconciliation establishes the state.

## Post-incident
Complete root-cause analysis, contributing factors, control gaps, remediation owners, due dates, and a review of monitoring/runbooks. Material incidents must have preserved evidence appropriate to applicable legal and regulatory obligations.
