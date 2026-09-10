import { Result, err, ok } from './result.js';
import { DomainError, domainError } from './errors.js';
export type Instant = string & { readonly __brand: 'Instant' };
const UTC_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
export const Instant = {
  from(value: string): Result<Instant, DomainError> {
    const date = new Date(value);
    if (!UTC_ISO.test(value) || Number.isNaN(date.getTime())) return err(domainError('INVALID_INSTANT', 'Instant must be an ISO 8601 UTC timestamp'));
    return ok(date.toISOString() as Instant);
  },
  now(): Instant { return new Date().toISOString() as Instant; }
};
