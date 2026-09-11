# Secrets Management Policy

1. Never commit secrets, credentials, private keys, API keys, or production certificates to Git.
2. Round 1 testnet private keys are explicitly development-only and must never be used on mainnet.
3. Production secrets must be stored in an approved secrets manager/KMS; applications receive references or short-lived credentials where possible.
4. Rotate credentials after suspected exposure and on a defined lifecycle.
5. Scope credentials to the minimum network, database, contract, and action permissions required.
6. Do not log secret values. Redact authorization headers, tokens, PAN/CVV, and direct customer identifiers from telemetry.
7. CI/CD must use ephemeral secret injection and must not print secret environment variables.
8. HSM/KMS signing keys must be non-exportable and protected by policy controls and audit logging.
