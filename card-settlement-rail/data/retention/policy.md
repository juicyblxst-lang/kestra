# Data retention policy

1. **Transaction and settlement records:** retain for 7 years by default, or longer only where a documented legal/regulatory obligation requires it.
2. **Ledger records:** retain for 7 years because they support financial reconciliation and auditability.
3. **Audit logs:** retain for at least 7 years and preserve hash-chain integrity.
4. **Clearing artifacts:** retain for 7 years unless scheme rules or law require a different period.
5. **Operational telemetry:** retain only as long as needed for reliability/security investigations; default target is 90 days.
6. **Development data:** synthetic only. Never copy production PII or credentials into seeds, fixtures, local databases, or analytics environments.
7. **Deletion:** retention jobs must use controlled, logged deletion with legal-hold exceptions. Regulatory or litigation holds override ordinary expiry.
8. **Minimization:** PAN, CVV, private keys, authentication secrets, and raw credentials are prohibited from this data layer.

Owners must review retention periods annually and whenever applicable law, card-network rules, or contractual requirements change.
