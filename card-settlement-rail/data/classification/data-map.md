# Data map

| Data domain | System of record | Consumers | Classification | Controls |
|---|---|---|---|---|
| Accounts | PostgreSQL | Core, reconciliation, compliance | Confidential | RLS, service-role access, audit |
| Transactions | PostgreSQL | Core, clearing, analytics | Confidential | RLS, idempotency, encryption at rest |
| Ledger | PostgreSQL | Core, settlement | Restricted | Double-entry invariants, RLS, audit |
| Clearing files | Object storage + PostgreSQL metadata | Clearing/reconciliation | Confidential | SHA-256 integrity, least privilege |
| Settlements | PostgreSQL | Merchant/acquirer consoles, reporting | Confidential | RLS, immutable references, audit |
| Interchange | PostgreSQL | Finance/reporting | Confidential | RLS, aggregation |
| Events | PostgreSQL partitions | Workers, analytics | Restricted | RLS, partition lifecycle, minimization |
| Audit | PostgreSQL + object storage | Security/compliance | Restricted | Append-only semantics, hash chain |
| Analytics | dbt/PostgreSQL | Metabase | Internal/Confidential | Read-only analytics role, aggregated PII |

**Data flow:** transaction ingress → ledger/clearing → settlement → reconciliation/reporting. Analytics reads controlled warehouse projections and must not become a second system of record.
