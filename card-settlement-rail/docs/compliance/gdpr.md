# GDPR / Data Protection

This document defines engineering guardrails; it is not legal advice.

## Data principles
- Purpose limitation: collect and process only data needed for payment, fraud, AML, sanctions, and legal obligations.
- Data minimization: avoid raw identity documents, full PAN, CVV, and unnecessary personal data in application telemetry.
- Accuracy: provide correction/update paths for customer data and screening profiles.
- Storage limitation: apply documented retention schedules to customer, transaction, compliance, and audit records.
- Security: encrypt sensitive data in transit and at rest, restrict access by role, and audit privileged operations.
- Privacy by design: define processing purposes, data flows, processors, and international transfer mechanisms before production expansion.

## Rights and exceptions
Requests for access, correction, deletion, restriction, portability, or objection must be evaluated against the applicable legal basis and statutory retention duties. AML, fraud, settlement, and financial-record obligations can limit immediate deletion.

## Engineering requirements
PII should have explicit classification and ownership. Logs and traces must use redaction. Data exports must be access-controlled and auditable. Incident response must cover unauthorized disclosure and regulator/customer notification obligations where applicable.
