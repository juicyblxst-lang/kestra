import { context, trace } from "@opentelemetry/api";
import { NodeSDK } from "@opentelemetry/sdk-node";

let sdk: NodeSDK | undefined;

export function startTracing(serviceName = process.env.OTEL_SERVICE_NAME ?? "card-settlement"): NodeSDK {
  if (sdk) return sdk;
  sdk = new NodeSDK({ serviceName });
  void sdk.start();
  return sdk;
}

export async function stopTracing(): Promise<void> {
  if (!sdk) return;
  await sdk.shutdown();
  sdk = undefined;
}

export function activeSpanName(): string | undefined {
  return trace.getSpan(context.active())?.spanContext().traceId;
}
