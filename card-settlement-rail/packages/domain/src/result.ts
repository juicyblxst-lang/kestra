export type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
export const Result = {
  sequence<T, E>(results: readonly Result<T, E>[]): Result<T[], E> {
    const values: T[] = [];
    for (const result of results) { if (!result.ok) return result; values.push(result.value); }
    return ok(values);
  }
};
