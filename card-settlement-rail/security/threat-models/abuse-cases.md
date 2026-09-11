# Abuse Cases

## Chargeback abuse
Attackers repeatedly submit false disputes or collude with merchants. Controls: transaction ownership checks, idempotency keys, reason/evidence validation, velocity limits, audit trail, compliance review, and immutable state transitions.

## Double-spend
A client retries or races payout/settlement requests. Controls: ledger idempotency constraint, database transaction/advisory lock, monotonic transaction state machine, unique external references, and chain receipt verification.

## Replay
A valid API request or webhook is replayed. Controls: short-lived signed credentials, idempotency keys, request IDs, timestamp/replay windows where protocol supports them, and HMAC verification over the exact body.

## Oracle manipulation
A malicious or stale exchange/risk input causes an unsafe settlement. Controls: allowlisted providers, freshness bounds, sanity ranges, quorum/secondary source for material decisions, circuit breakers, and manual approval for anomalous values.

## Abuse-response rule
Financially material anomalies are fail-closed: do not sign, settle, or release funds until policy and reconciliation checks succeed.
