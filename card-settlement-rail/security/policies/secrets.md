# Secrets Policy

No secrets, private keys, API tokens, PANs, CVVs, or credentials belong in Git. Round 1 uses environment-variable names only and no live credentials.

Use managed secret storage/KMS for production. Rotate on schedule and immediately after suspected compromise. Keep signing keys isolated from application workers; production signing must use HSM/KMS-backed keys. Never log secret values.
