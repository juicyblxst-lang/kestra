# Access Control Policy

## Principles
Least privilege, deny by default, separation of duties, strong authentication, short-lived credentials, and auditable privileged access.

## Roles
The application RBAC roles are `acquirer`, `issuer`, `network_ops`, `merchant`, `compliance`, and `admin`. CASL policies are the application authorization layer; role claims alone never grant an action outside policy.

## Privileged actions
Settlement, configuration changes, key-management operations, production database access, and compliance approvals require dedicated permissions and audit evidence. Production settlement signing must be isolated behind an HSM/KMS policy boundary.

## Lifecycle
Access must be provisioned from an approved request, reviewed periodically, revoked promptly on role change/offboarding, and never shared. Break-glass access must be time-bounded and reviewed after use.
