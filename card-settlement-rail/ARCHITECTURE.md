# Card Settlement Rail — Architecture

## System boundary
```text
                    CARD NETWORK / AUTHORIZATION
                              |
                              v
+----------------+     +-------------+     +----------------+
| Cardholder /   | --> | Acquirer    | --> | Settlement     |
| Merchant       |     | Gateway     |     | Rail (Kestra)  |
+----------------+     +-------------+     +-------+--------+
                                                   |
                         +-------------------------+-------------------+
                         |                         |                   |
                         v                         v                   v
                   +-----------+            +-----------+       +-----------+
                   | Core      |            | Edge      |       | Compliance|
                   | Ledger &  |            | Connectors |       | / AML     |
                   | Settlement|            | / Webhooks |       |           |
                   +-----+-----+            +-----------+       +-----------+
                         |
                         v
                   +-----------+
                   | Bank /     |
                   | Issuer &   |
                   | Acquirer   |
                   | Settlement|
                   +-----------+
```

## Data flow
1. An authorized card transaction enters through an acquirer integration.
2. Core validates the transaction, records an immutable domain state transition, and emits a versioned event.
3. Transactions are grouped into settlement batches according to the settlement policy.
4. Compliance and sanctions controls run before funds movement.
5. The rail submits settlement instructions to connected financial institutions.
6. Confirmations are reconciled against the internal ledger and emitted as settlement events.
7. Idempotency keys and durable identifiers make retries safe; monetary values remain integer minor units.

## Deployment topology
```text
                 Internet / Private Partner Networks
                              |
                        [Edge Services]
                              |
                    [Core API + Workers]
                     /        |        \
                [Postgres] [Event Bus] [Cache]
                              |
                    [Bank / Network APIs]

  Cron workers -> Core / Reconciliation / Settlement / Compliance
  Observability -> metrics + structured logs + traces
```

The rail is designed for continuous operation. Weekend and overnight settlement are normal operating periods, not exceptional cases.
