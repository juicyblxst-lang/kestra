export type DomainError =
  | { readonly code: 'INVALID_CURRENCY'; readonly message: string }
  | { readonly code: 'NEGATIVE_MONEY'; readonly message: string }
  | { readonly code: 'CURRENCY_MISMATCH'; readonly message: string }
  | { readonly code: 'INSUFFICIENT_FUNDS'; readonly message: string }
  | { readonly code: 'INVALID_ALLOCATION'; readonly message: string }
  | { readonly code: 'INVALID_INSTANT'; readonly message: string }
  | { readonly code: 'INVALID_ID'; readonly message: string };
export const domainError = <C extends DomainError['code']>(code: C, message: string): DomainError => ({ code, message } as DomainError);
