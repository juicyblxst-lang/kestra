# Security

## Vulnerability disclosure

Please do not disclose suspected vulnerabilities publicly before remediation. Report security issues privately to the repository security contact or through GitHub's private vulnerability reporting when enabled.

Include a concise description, affected component/path, reproduction steps, security impact, and a minimal proof of concept where safe. Do not include credentials, PAN/CVV, customer PII, or other secrets.

We will acknowledge valid reports, triage severity, coordinate remediation, and provide a responsible-disclosure timeline. Financial or credential-compromise issues receive highest priority.

## Scope

This policy covers Card Settlement Rail source code, APIs, edge workers, SDKs, infrastructure configuration, and security controls maintained in this repository. Third-party systems are out of scope unless explicitly authorized.

## Round 1 security posture

Security scanning workflows remain manual-only. No production secrets or HSM credentials are stored in the repository. Production launch requires independent penetration testing, managed secret storage, HSM/KMS-backed signing, and compliance approval.
