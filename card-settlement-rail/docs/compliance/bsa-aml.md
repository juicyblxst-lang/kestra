# BSA / AML Program Mapping

This is an engineering control map for a future U.S.-regulated operating model. Applicability depends on the legal entity, activities, licensing, and jurisdictions involved.

## Program components
- Customer identification and risk-based due diligence.
- Sanctions and PEP screening.
- Transaction monitoring and alert generation.
- Investigation and escalation procedures.
- Suspicious Activity Report (SAR) governance where legally required.
- Recordkeeping and retention.
- Independent testing and compliance training.
- Designated compliance ownership and documented management oversight.

## Code support
`packages/compliance` implements baseline sanctions matching, AML rules, IVMS101 encoding/decoding, and PCI log redaction. These are supporting controls and do not constitute a complete BSA/AML program.

## SAR boundary
The repository must not automatically file a SAR merely because a rule fires. Production SAR workflows require authorized compliance personnel, case review, legal/regulatory determination, confidentiality controls, filing procedures, and required record retention.

Jurisdiction-specific counsel and the compliance officer must approve the final operating model before regulated launch.
