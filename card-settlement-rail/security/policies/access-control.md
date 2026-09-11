# Access Control Policy

Use least privilege, deny by default, and separate customer, operator, compliance, and administrative capabilities. Roles are `acquirer`, `issuer`, `network_ops`, `merchant`, `compliance`, and `admin`.

Privileged operations require authenticated service identity plus RBAC/CASL policy authorization. Production access must be individual, auditable, time-bound where possible, and protected with MFA. Settlement signing is a separate privilege from application administration.
