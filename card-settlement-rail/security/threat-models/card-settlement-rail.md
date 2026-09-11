# Card Settlement Rail — STRIDE Threat Model

## Scope
Round 1 covers browser/API clients, edge workers, core services, ledger/database, Redis/queues, sanctions/AML, settlement signer, blockchain contracts, clearing files, and observability.

| Component | Spoofing | Tampering | Repudiation | Information disclosure | Denial of service | Elevation of privilege |
|---|---|---|---|---|---|---|
| Web/API edge | JWT/API-key theft | request mutation | signed request/audit ID | PII leakage | rate limiting, quotas | RBAC/CASL |
| Core API | forged identity | idempotency bypass | immutable audit trail | least-privilege data access | bounded queues/timeouts | service auth + RBAC |
| Ledger/DB | service credential theft | double-entry mutation | transaction/audit records | encryption + row scoping | connection/lock limits | DB roles/migrations |
| Redis/queues | worker impersonation | job mutation/replay | job IDs + audit | payload minimization | backpressure/retries | ACLs/service identity |
| Sanctions/AML | provider impersonation | fixture/provider substitution | screening evidence | minimize match data | circuit breakers | compliance-only actions |
| Settlement signer | operator impersonation | unsigned/altered intent | signing/audit record | key isolation | signer rate limits | HSM/KMS + policy gate |
| Blockchain/contracts | forged caller | malicious calldata | on-chain receipts | public chain data | gas/RPC exhaustion | contract roles/pausing |
| Clearing | forged file/source | checksum/content tamper | file hashes | sensitive file exposure | ingestion limits | controlled operator access |
| Observability | log injection | metric/log alteration | append-only retention | PII in telemetry | telemetry overload | scoped access |

## Primary controls

1. Authenticate every privileged boundary; never trust client-supplied role claims without signature verification.
2. Enforce idempotency at transaction and ledger boundaries and validate double-entry invariants.
3. Keep settlement signing behind a policy boundary; Round 1 environment keys are testnet-only and must be replaced by HSM/KMS before production.
4. Minimize PII in logs and encrypt production PII with managed key infrastructure.
5. Use rate limits, bounded queues, timeouts, replay windows, and circuit breakers around external dependencies.
6. Maintain audit evidence for authorization, screening, signing, settlement, and operator actions.
7. Treat blockchain confirmation as evidence, not as authorization; authorization must precede signing.

## Review status

**CTO security review: completed for Round 1.** The threat model and control set are accepted as the engineering baseline. Production approval remains gated on independent penetration testing, HSM/KMS integration, production secrets management, disaster recovery testing, and compliance sign-off.
