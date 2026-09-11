# Card Settlement Rail — STRIDE Threat Model

Scope: browser/API clients, edge workers, core API, ledger/database, queues, compliance, signer, blockchain, clearing, SDKs, and telemetry.

| Component | Spoofing | Tampering | Repudiation | Information disclosure | DoS | Elevation |
|---|---|---|---|---|---|---|
| Edge/API | stolen JWT/API key | request mutation | request/audit IDs | PII leakage | rate limits/timeouts | RBAC/CASL |
| Core/ledger | service impersonation | double-entry mutation | immutable audit | scoped/encrypted data | DB/queue limits | DB roles + policy gates |
| Queues | worker impersonation | job mutation/replay | durable job IDs | payload minimization | backpressure | service identity |
| Compliance | provider impersonation | screening substitution | screening evidence | match-data minimization | circuit breaker | compliance-only actions |
| Signer | operator impersonation | altered intent | signed intent/audit | key isolation | signer limits | HSM/KMS + policy |
| Chain/indexer | forged events | reorg/data corruption | block/tx evidence | public-chain exposure | RPC exhaustion | contract roles |
| Webhooks/SDKs | endpoint/API-key spoofing | payload alteration | request IDs/signatures | merchant PII | retry/backoff | scoped credentials |
| Observability | log injection | telemetry mutation | retained audit trail | PII in logs | telemetry overload | access controls |

## Required controls

- Verify authentication at every privileged boundary; never trust client role claims.
- Enforce idempotency and double-entry invariants before settlement.
- Verify webhook HMAC against the exact raw body and reject malformed signatures.
- Authorize before signing; blockchain confirmation is evidence, not authorization.
- Use testnet-only environment keys in Round 1. Production requires HSM/KMS.
- Encrypt/minimize PII and prohibit PAN/CVV from telemetry.
- Bound retries, queues, RPC ranges, and external request timeouts.

## CTO review

Round 1 controls are documented and ready for CTO review. Production release remains gated on independent penetration testing, HSM/KMS integration, secrets-management controls, DR testing, and compliance approval.
