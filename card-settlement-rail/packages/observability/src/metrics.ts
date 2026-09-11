import { Counter, Gauge, Histogram, Registry, collectDefaultMetrics } from "prom-client";

export const registry = new Registry();
collectDefaultMetrics({ register: registry });

export const httpRequestsTotal = new Counter({ name: "settlement_http_requests_total", help: "Total HTTP requests", labelNames: ["method", "route", "status"], registers: [registry] });
export const httpRequestDurationSeconds = new Histogram({ name: "settlement_http_request_duration_seconds", help: "HTTP request duration", labelNames: ["method", "route"], registers: [registry], buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5] });
export const settlementFailures = new Counter({ name: "settlement_failures_total", help: "Settlement failures", labelNames: ["reason"], registers: [registry] });
export const pendingSettlements = new Gauge({ name: "settlement_pending_count", help: "Current pending settlement count", registers: [registry] });

export function metricsText(): Promise<string> { return registry.metrics(); }
