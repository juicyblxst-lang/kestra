# @card-settlement/crypto

Cryptographic helpers for the Card Settlement Rail.

## Round 1 boundary

The AES-GCM PII helper and environment private-key loader are **development/testnet only**. They are not an HSM, KMS, custody system, or production secret-management boundary. Never use `OPERATOR_PRIVATE_KEY_TESTNET_ONLY` on mainnet.

EIP-712 signing is provided for deterministic transaction authorization and can be used with viem accounts. Production signing must move to an HSM/KMS-backed signer with non-exportable keys, policy controls, audit logging, rotation, quorum/approval where appropriate, and transaction simulation before signing.

## HSM upgrade path

1. Keep application code dependent on a signer interface rather than raw private keys.
2. Implement an HSM/KMS adapter using the institution's approved provider.
3. Store only key references in application configuration.
4. Enforce network/contract/chain allowlists in the signer boundary.
5. Add dual-control approval for privileged settlement operations.
6. Emit immutable audit events for every signing request and result.
7. Retire all environment-loaded production private keys before mainnet authorization.
