import * as Sentry from "@sentry/node";

let initialized = false;

export function initSentry(options: { dsn?: string; environment?: string; tracesSampleRate?: number } = {}): boolean {
  const dsn = options.dsn ?? process.env.SENTRY_DSN;
  if (!dsn || initialized) return false;
  Sentry.init({ dsn, environment: options.environment ?? process.env.NODE_ENV ?? "development", tracesSampleRate: options.tracesSampleRate ?? 0.05 });
  initialized = true;
  return true;
}

export function captureException(error: unknown, context?: Record<string, unknown>): string | undefined {
  if (!initialized) return undefined;
  return Sentry.withScope((scope) => {
    if (context) scope.setExtras(context);
    return Sentry.captureException(error);
  });
}
