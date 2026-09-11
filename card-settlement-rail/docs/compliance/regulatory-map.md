# Regulatory Map

This map is a planning artifact, not a legal conclusion. Regulatory scope must be determined from the final legal entity, product flow, counterparties, geography, and licensing model.

| Area | Engineering concern | Ownership / decision |
|---|---|---|
| Payments / money transmission | Licensing, safeguarding, settlement finality, disclosures | Legal + Compliance |
| AML / CFT | KYC/CDD, monitoring, escalation, SAR/STR, records | Compliance |
| Sanctions | Screening, list updates, review, blocking/release | Compliance + Operations |
| Travel Rule | Originator/beneficiary information and VASP obligations where applicable | Compliance + Legal |
| PCI DSS | Cardholder-data scope, segmentation, logging, access, security | Security + Compliance |
| Privacy | Lawful basis, minimization, retention, rights, transfers | Privacy + Legal |
| Operational resilience | Incident response, recovery, reconciliation, controls | Engineering + Risk |

## Current implementation boundary
Round 1 uses static sanctions fixtures and deterministic AML rules. No live sanctions feed, paid KYC provider, or automated regulatory filing is enabled.

## Governance
Every jurisdictional launch should have a signed regulatory applicability assessment, control owner, evidence source, escalation path, and review date. Material product or settlement-flow changes trigger reassessment.
