# Card Settlement Rail

Card Settlement Rail (Kestra) is financial infrastructure for moving the money behind card payments in near real time. The objective is to replace slow, batch-oriented settlement with a continuously operating settlement rail while preserving strong controls, auditability, reconciliation, and idempotency.

## Repository foundation
- `packages/domain` — money-safe domain primitives and identifiers.
- `packages/contracts` — API and event contract skeletons.
- `packages/events` — versioned event envelopes and Avro schemas.
- `packages/testing` — deterministic fixtures and in-memory test harness.

The remaining applications and services are layered on these contracts in subsequent implementation rounds.

## Requirements
- Node.js 22.x
- pnpm 9.x

## Install
```bash
pnpm install
```

## Test
```bash
pnpm test
```

## Build
```bash
pnpm build
```

No production credentials are required for the foundation package. CI workflows are present but intentionally manual-only until environments and credentials are provisioned.
