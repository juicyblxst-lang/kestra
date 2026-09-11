const PAN_PATTERN = /\b(?:\d[ -]?){13,19}\b/g;
const CVV_KEY_PATTERN = /\b(cvv|cvc|cid|securityCode|security_code)\b\s*[:=]\s*['\"]?\d{3,4}['\"]?/gi;

export function maskPan(pan: string): string {
  const digits = pan.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) throw new Error("PAN must contain 13-19 digits");
  return `${"*".repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
}

export function maskSensitiveText(input: string): string {
  const withoutCvv = input.replace(CVV_KEY_PATTERN, (match) => match.replace(/\d{3,4}(?=['\"]?\s*$)/, "***"));
  return withoutCvv.replace(PAN_PATTERN, (match) => {
    const digits = match.replace(/\D/g, "");
    return digits.length >= 13 && digits.length <= 19 ? maskPan(digits) : match;
  });
}

export function redactForLog(value: unknown): unknown {
  if (typeof value === "string") return maskSensitiveText(value);
  if (Array.isArray(value)) return value.map(redactForLog);
  if (value && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(source)) {
      if (/^(cvv|cvc|cid|securityCode|security_code)$/i.test(key)) output[key] = "[REDACTED]";
      else if (/^(pan|cardNumber|card_number)$/i.test(key) && typeof item === "string") output[key] = maskPan(item);
      else output[key] = redactForLog(item);
    }
    return output;
  }
  return value;
}

export function safeLog<T extends (...args: never[]) => unknown>(logger: T): (...args: Parameters<T>) => ReturnType<T> {
  return ((...args: Parameters<T>) => logger(...(args.map(redactForLog) as Parameters<T>))) as (...args: Parameters<T>) => ReturnType<T>;
}
