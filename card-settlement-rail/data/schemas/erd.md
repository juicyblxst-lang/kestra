# Card Settlement Rail ERD

```mermaid
erDiagram
  ACCOUNTS ||--o{ LEDGER_ACCOUNTS : owns
  ACCOUNTS ||--o{ TRANSACTIONS : merchant
  ACCOUNTS ||--o{ TRANSACTIONS : acquirer
  ACCOUNTS ||--o{ TRANSACTIONS : issuer
  SETTLEMENT_BATCHES ||--o{ CLEARING_FILES : contains
  SETTLEMENT_BATCHES ||--o{ SETTLEMENTS : produces
  ACCOUNTS ||--o{ SETTLEMENTS : receives
  TRANSACTIONS ||--o{ INTERCHANGE_RECORDS : priced_by
  LEDGER_ACCOUNTS ||--o{ LEDGER_ENTRIES : records
  TRANSACTIONS ||--o{ LEDGER_ENTRIES : posts

  ACCOUNTS { uuid id PK string external_id UK string account_type string legal_name string status string country_code string currency }
  LEDGER_ACCOUNTS { uuid id PK uuid account_id FK string code UK string currency decimal balance decimal available_balance bigint version }
  LEDGER_ENTRIES { uuid id PK uuid ledger_account_id FK uuid transaction_id FK string entry_type decimal amount string currency string idempotency_key UK }
  TRANSACTIONS { uuid id PK string external_id UK uuid merchant_id FK uuid acquirer_id FK uuid issuer_id FK decimal amount string currency string status timestamptz occurred_at }
  SETTLEMENT_BATCHES { uuid id PK string batch_reference UK uuid acquirer_id FK date settlement_date string currency integer transaction_count decimal gross_amount decimal net_amount string status }
  CLEARING_FILES { uuid id PK uuid batch_id FK string file_reference UK string file_type string storage_uri string sha256 integer record_count string status }
  SETTLEMENTS { uuid id PK uuid batch_id FK uuid merchant_id FK decimal amount decimal fees decimal net_amount string currency string status string settlement_reference UK timestamptz settled_at }
  INTERCHANGE_RECORDS { uuid id PK uuid transaction_id FK string network_code decimal rate_bps decimal fee_amount string currency decimal assessment_amount }
  EVENTS { uuid id PK uuid event_id string aggregate_type uuid aggregate_id string event_type jsonb payload timestamptz occurred_at }
  AUDIT_LOG { bigint id PK uuid event_id UK uuid actor_id string actor_type string action string resource_type string resource_id jsonb payload string previous_hash string entry_hash UK timestamptz created_at }
```

`events` is range-partitioned by `occurred_at`; production operations should create future monthly partitions before they are needed. `audit_log` is append-only at the application layer and cryptographically hash-chained by its database trigger.
