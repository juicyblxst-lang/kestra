# Card Settlement Rail — Smart Contracts

This directory contains the settlement-layer contracts for Card Settlement Rail. Contracts are intentionally deployment-agnostic in Round 1: no testnet deployment, private keys, or live RPC configuration are committed.

## Architecture

- **Settlement** — operator-controlled settlement entry point. A settlement is accepted only when the supplied counterparty amounts net to zero and a non-zero netting root is supplied.
- **Netting** — deterministic arithmetic library used by `Settlement` to enforce zero-sum netting.
- **Interchange** — records acquirer/issuer interchange obligations with an immutable operator role.
- **Chargeback** — tracks chargeback cases through filed, represented, and resolved states with evidence hashes.
- **Reserve** — holds native-token reserves and permits the operator to release or slash reserved funds.
- **FX** — oracle-controlled fixed-point FX rates and deterministic conversion using 1e18 scaling.
- **Finality** — records an immutable first attestation for a settlement identifier.
- **Multicall** — reusable delegatecall batching primitive for contract surfaces that inherit it.
- **SignatureChecker** — EIP-712 domain/digest helpers plus EOA and ERC-1271 signature verification.

The contracts deliberately keep policy and orchestration off-chain. Core settlement state transitions are explicit, deterministic, and auditable.

## Function reference

| Contract | Function | Purpose |
| --- | --- | --- |
| Settlement | `settle(root, counterparties, amounts)` | Execute a zero-sum settlement under the operator role. |
| Netting | `verifySum(amounts)` | Revert unless the signed integer net is exactly zero. |
| Interchange | `recordInterchange(acquirer, issuer, amount)` | Record an interchange obligation. |
| Chargeback | `fileChargeback(...)` | Open a chargeback case with evidence metadata. |
| Chargeback | `representChargeback(id, evidenceHash)` | Submit/replace representment evidence. |
| Chargeback | `resolveChargeback(id, merchantLiable, resolutionHash)` | Close a filed or represented case. |
| Reserve | `depositReserve(account)` | Deposit native currency to an account reserve. |
| Reserve | `releaseReserve(account, amount)` | Return reserve funds to the reserved account. |
| Reserve | `slashReserve(account, recipient, amount, reason)` | Transfer reserved funds to an operator-selected recipient. |
| FX | `setRate(pair, rate)` | Publish an oracle rate using 1e18 fixed-point scaling. |
| FX | `convert(amount, from, to)` | Convert using `keccak256(abi.encode(from,to))` as the pair key. |
| Finality | `attestFinality(settlementId)` | Record the first attestation and timestamp for a settlement. |

## Security model

Operator and oracle roles are explicit constructor-set addresses. Zero-address and zero-value guards are enforced on state-changing monetary paths. Chargeback transitions are state-gated, reserve balances are checked before debit, and settlement netting cannot be accepted when the supplied amounts do not sum to zero.

This is Round 1 implementation code, not a mainnet-audited financial system. Independent audit and formal verification remain prerequisites for production deployment.

## Testnet plan — Round 2

1. Supply deployment RPC URLs, deployer private key, operator, oracle, and explorer API credentials through environment variables only.
2. Run `forge build` and `forge test` locally before any deployment.
3. Run Slither locally and resolve all high/medium findings.
4. Deploy with `script/Deploy.s.sol` to the selected testnet.
5. Verify deployed contracts with `script/Verify.s.sol` and the chain's explorer.
6. Persist deployment addresses in the matching `deployments/{chain}.json` file.
7. Export and review ABI artifacts in `packages/contracts/abis/` before wiring application services.
8. Perform end-to-end settlement tests against testnet contracts before production/mainnet consideration.

No testnet deployment is performed in Round 1.
