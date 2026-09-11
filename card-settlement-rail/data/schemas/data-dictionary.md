# Data Dictionary

Classification: **Public** = safe operational metadata; **Internal** = business-sensitive; **Confidential** = restricted financial/identity data; **Restricted** = highly sensitive data requiring least-privilege access. Retention is a policy target, not permission to retain beyond applicable law.

| Table | Column | Meaning | PII class | Retention |
|---|---|---|---|---|
| accounts | id | Internal account UUID | Internal | Life + 7y |
| accounts | external_id | Stable customer/account reference | Confidential | Life + 7y |
| accounts | account_type | Merchant/acquirer/issuer role | Internal | Life + 7y |
| accounts | legal_name | Registered legal entity name | Confidential | Life + 7y |
| accounts | country_code | ISO country | Confidential | Life + 7y |
| ledger_accounts | balance | Book balance | Confidential | Life + 7y |
| ledger_entries | amount | Posted monetary amount | Confidential | 7y |
| ledger_entries | idempotency_key | Request deduplication key | Confidential | 7y |
| transactions | external_id | Processor transaction reference | Confidential | 7y |
| transactions | merchant_id | Merchant account reference | Confidential | 7y |
| transactions | acquirer_id | Acquirer account reference | Confidential | 7y |
| transactions | issuer_id | Issuer account reference | Confidential | 7y |
| transactions | amount | Transaction amount | Confidential | 7y |
| transactions | currency | ISO currency | Internal | 7y |
| transactions | metadata | Operational transaction attributes; never store PAN/CVV | Restricted | 7y |
| settlement_batches | batch_reference | Clearing/settlement batch reference | Confidential | 7y |
| settlement_batches | gross_amount | Batch gross value | Confidential | 7y |
| settlement_batches | net_amount | Batch net value | Confidential | 7y |
| clearing_files | storage_uri | Clearing artifact location | Confidential | 7y |
| clearing_files | sha256 | Artifact integrity digest | Internal | 7y |
| settlements | amount | Settlement amount | Confidential | 7y |
| settlements | fees | Settlement fee | Confidential | 7y |
| settlements | settlement_reference | Settlement identifier | Confidential | 7y |
| interchange_records | rate_bps | Interchange rate | Internal | 7y |
| interchange_records | fee_amount | Interchange fee | Confidential | 7y |
| events | payload | Domain event payload; minimize PII | Restricted | 7y |
| audit_log | actor_id | Actor account identifier | Confidential | 7y minimum |
| audit_log | payload | Audit context; redact secrets | Restricted | 7y minimum |
| audit_log | entry_hash | Tamper-evident chain hash | Internal | 7y minimum |

**Never store:** PAN, CVV, magnetic-stripe data, private keys, authentication secrets, or raw credentials in transactional tables. Use tokens/references and external vaults where such data is required.
