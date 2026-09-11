# Abuse Cases

## Chargeback abuse
**Scenario:** A legitimate authorization is repeatedly disputed or a merchant colludes to manufacture refunds/chargebacks.

**Controls:** unique transaction identifiers, evidence retention, velocity/risk rules, merchant-level anomaly detection, dispute state machine, segregation of duties, and manual compliance escalation.

## Double-spend
**Scenario:** The same payment intent is submitted concurrently or settlement is attempted twice.

**Controls:** database idempotency keys, unique transaction constraints, ledger double-entry invariants, serialized settlement transitions, on-chain nonce management, and receipt reconciliation.

## Replay
**Scenario:** A previously valid signed authorization or API request is submitted again.

**Controls:** short token TTLs, `jti`/request IDs, nonce or idempotency key uniqueness, domain/chain binding for EIP-712, and state-machine validation before execution.

## Oracle manipulation
**Scenario:** An attacker changes a rate, risk signal, or external market value used by settlement logic.

**Controls:** trusted data-source allowlists, bounded freshness windows, deviation limits, independent source comparison, circuit breakers, and no blind execution from a single untrusted oracle.

## Additional high-impact cases

- Credential stuffing against merchant/operator accounts.
- API-key leakage in logs or source control.
- Privilege escalation through role claims or object-level authorization gaps.
- Malicious clearing-file injection or checksum bypass.
- Queue flooding that starves settlement jobs.
- RPC response manipulation or chain reorg handling failures.
- Insider misuse of compliance or settlement privileges.
