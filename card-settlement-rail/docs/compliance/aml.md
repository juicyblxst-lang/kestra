# AML Transaction Monitoring

Round 1 implements deterministic, testable rules in `packages/compliance/src/aml/rules.ts`.

## Rules
| Rule | Trigger | Default risk |
|---|---|---|
| Velocity | More than 5 transactions for a customer in one hour | High |
| Structuring | Single transaction from $9,000 through below $10,000 using minor units | High |
| High-risk geography | Transaction/profile country is in the configured high-risk set | High |
| PEP | Customer is identified as a politically exposed person | Critical |

The rules return a normalized `{ risk, rules[] }` assessment. Amounts are represented as integers in minor currency units to avoid floating-point money calculations.

## Production controls
Rules are baseline detection controls, not a complete AML program. Production requires customer risk scoring, transaction aggregation, alert case management, investigation workflows, sanctions/PEP data providers, SAR/STR procedures, tuning, model/rule governance, and jurisdiction-specific legal review.

## Escalation
A high or critical result must not be silently cleared by an automated workflow. The production case-management layer should preserve the rule identifiers, input snapshot, decision timestamp, reviewer/action history, and audit trail.
