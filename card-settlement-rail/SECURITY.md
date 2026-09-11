# Security Policy

## Supported versions
Security fixes are applied to the current `main` development line during the build phase. Production support commitments will be defined before launch.

## Reporting a vulnerability
Please do **not** disclose suspected vulnerabilities in public GitHub issues.

For Round 1, report privately to the repository owner/security contact with:
- affected component and version/commit;
- concise reproduction steps or proof of concept;
- impact and attack prerequisites;
- any known indicators of compromise.

Never include payment-card data, customer PII, credentials, private keys, or other secrets in a report. Redact sensitive evidence before submission.

## Response expectations
Security reports are triaged by severity. Critical issues involving settlement authorization, signing keys, material customer data, or systemic privilege escalation receive immediate containment priority.

We will acknowledge valid reports, investigate and reproduce where possible, coordinate remediation, and provide disclosure guidance when appropriate. Do not publicly disclose an issue until remediation and coordinated disclosure timing have been agreed.

## Safe testing
Do not test against production systems, attempt denial of service, access other users' data, or perform actions that could move real funds without explicit written authorization.

The funded penetration-testing and bug-bounty programs are not active in Round 1; see `security/pen-test/` and `security/bug-bounty/` for the planned path.
