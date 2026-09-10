import { Result, err, ok } from './result.js';
import { DomainError, domainError } from './errors.js';
import { Currency, CURRENCY_MINOR_UNITS } from './currency.js';

export class Money {
  private constructor(private readonly minorUnits: bigint, private readonly currencyCode: Currency) {}
  get minor(): bigint { return this.minorUnits; }
  get currency(): Currency { return this.currencyCode; }
  static fromMinor(minor: bigint, currency: Currency): Result<Money, DomainError> {
    if (!(currency in CURRENCY_MINOR_UNITS)) return err(domainError('INVALID_CURRENCY', `Unsupported currency: ${currency}`));
    if (minor < 0n) return err(domainError('NEGATIVE_MONEY', 'Money cannot be negative'));
    return ok(new Money(minor, currency));
  }
  static zero(currency: Currency): Result<Money, DomainError> { return Money.fromMinor(0n, currency); }
  add(other: Money): Result<Money, DomainError> {
    if (this.currency !== other.currency) return err(domainError('CURRENCY_MISMATCH', 'Currencies must match'));
    return ok(new Money(this.minor + other.minor, this.currency));
  }
  subtract(other: Money): Result<Money, DomainError> {
    if (this.currency !== other.currency) return err(domainError('CURRENCY_MISMATCH', 'Currencies must match'));
    if (other.minor > this.minor) return err(domainError('INSUFFICIENT_FUNDS', 'Result would be negative'));
    return ok(new Money(this.minor - other.minor, this.currency));
  }
  allocate(ratios: readonly bigint[]): Result<Money[], DomainError> {
    if (ratios.length === 0 || ratios.some(r => r < 0n)) return err(domainError('INVALID_ALLOCATION', 'Ratios must be non-empty and non-negative'));
    const total = ratios.reduce((sum, ratio) => sum + ratio, 0n);
    if (total === 0n) return err(domainError('INVALID_ALLOCATION', 'At least one ratio must be positive'));
    const parts = ratios.map(ratio => new Money((this.minor * ratio) / total, this.currency));
    let remainder = this.minor - parts.reduce((sum, part) => sum + part.minor, 0n);
    for (let i = 0; remainder > 0n; i = (i + 1) % parts.length, remainder--) parts[i] = new Money(parts[i].minor + 1n, this.currency);
    return ok(parts);
  }
  equals(other: Money): boolean { return this.currency === other.currency && this.minor === other.minor; }
  toString(): string { return `${this.currency} ${this.minor}`; }
}
