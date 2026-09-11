# PCI DSS Controls

The settlement rail follows a minimize-and-isolate approach for payment-card data.

## Round 1 controls
- PANs must never be written to application logs.
- CVV/CVC/CID and equivalent sensitive authentication data are always redacted from structured log objects.
- `packages/compliance/src/pci/mask.ts` provides reusable PAN masking and log redaction primitives.
- Test fixtures must use non-sensitive test values only.

## Production boundary
Where possible, use a PCI-compliant tokenization provider so the core platform does not handle raw PAN. If raw cardholder data enters the environment, scope, segmentation, encryption, key management, access control, vulnerability management, monitoring, retention, and evidence requirements must be assessed against the applicable PCI DSS version.

Masking is a logging safeguard; it is not encryption, tokenization, or a reduction of PCI scope by itself.

## Release gate
Security must verify log sinks, traces, error reporters, analytics, database snapshots, support tooling, and backups for accidental card-data capture before production handling of payment credentials.
