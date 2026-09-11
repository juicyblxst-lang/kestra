# KYC / Customer Due Diligence

## Round 1 control boundary
The settlement rail does not integrate Persona, Onfido, or another paid identity provider in Round 1. Identity verification is therefore an integration boundary, not a claim that production KYC has been completed.

## Required production controls
- Establish customer identity and beneficial ownership before enabling regulated payment activity.
- Collect only fields required for the applicable legal basis and risk decision.
- Validate identity evidence, document authenticity, sanctions exposure, PEP status, and expected activity.
- Apply enhanced due diligence for higher-risk customers and geographies.
- Retain evidence and decision metadata according to the applicable retention schedule.
- Require human review for unresolved identity or sanctions cases; automated matching is decision support, not a final legal determination.

## System boundary
`packages/compliance` supplies deterministic screening/risk primitives. A future KYC adapter must expose normalized results without placing identity documents or raw sensitive evidence into application logs.

## Release gate
Production enablement requires documented KYC ownership, escalation procedures, retention/deletion controls, and jurisdiction-specific legal review.
