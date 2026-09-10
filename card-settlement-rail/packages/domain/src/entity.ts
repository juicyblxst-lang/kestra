export type Entity = {
  readonly id: string;
  readonly createdAt: Instant;
  readonly updatedAt: Instant;
  readonly version: number;
};
import type { Instant } from './instant.js';
export type Brand<T, B extends string> = T & { readonly __brand: B };
export type MerchantId = Brand<string, 'MerchantId'>;
export type AcquirerId = Brand<string, 'AcquirerId'>;
export type IssuerId = Brand<string, 'IssuerId'>;
export type CardId = Brand<string, 'CardId'>;
export type TransactionId = Brand<string, 'TransactionId'>;
export type BatchId = Brand<string, 'BatchId'>;
export type SettlementId = Brand<string, 'SettlementId'>;
