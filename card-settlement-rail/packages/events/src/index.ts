import type { Instant } from '@card-settlement/domain';
export type EventMetadata = Readonly<Record<string, string>>;
export interface EventEnvelope<TPayload> { readonly id: string; readonly type: string; readonly version: number; readonly occurredAt: Instant; readonly payload: TPayload; readonly metadata: EventMetadata; }
export interface TransactionAuthorized { transactionId: string; merchantId: string; acquirerId: string; issuerId: string; amountMinor: string; currency: string; authorizationCode: string; }
export interface BatchSubmitted { batchId: string; acquirerId: string; transactionIds: string[]; totalAmountMinor: string; currency: string; submittedAt: Instant; }
export interface SettlementCompleted { settlementId: string; batchId: string; amountMinor: string; currency: string; settledAt: Instant; reference: string; }
export type CardSettlementEvent = TransactionAuthorized | BatchSubmitted | SettlementCompleted;
