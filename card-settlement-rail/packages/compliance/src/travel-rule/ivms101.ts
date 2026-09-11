export interface Ivms101Person {
  name: string;
  accountNumber?: string;
  country?: string;
  address?: string;
}

export interface Ivms101Message {
  originator: Ivms101Person;
  beneficiary: Ivms101Person;
  asset: string;
  amount: string;
  transactionId: string;
  timestamp: string;
}

function assertPerson(value: unknown, field: string): asserts value is Ivms101Person {
  if (!value || typeof value !== "object") throw new Error(`Invalid IVMS101 ${field}`);
  const person = value as Record<string, unknown>;
  if (typeof person.name !== "string" || person.name.trim() === "") throw new Error(`Invalid IVMS101 ${field}.name`);
}

export function encodeIvms101(message: Ivms101Message): string {
  assertPerson(message.originator, "originator");
  assertPerson(message.beneficiary, "beneficiary");
  if (!message.asset || !message.amount || !message.transactionId || !message.timestamp) {
    throw new Error("IVMS101 requires asset, amount, transactionId and timestamp");
  }
  return JSON.stringify({
    ivms101: "1.0",
    originator: message.originator,
    beneficiary: message.beneficiary,
    asset: message.asset,
    amount: message.amount,
    transactionId: message.transactionId,
    timestamp: message.timestamp,
  });
}

export function decodeIvms101(payload: string): Ivms101Message {
  let parsed: unknown;
  try { parsed = JSON.parse(payload); } catch { throw new Error("Invalid IVMS101 JSON"); }
  if (!parsed || typeof parsed !== "object" || (parsed as Record<string, unknown>).ivms101 !== "1.0") {
    throw new Error("Unsupported IVMS101 version");
  }
  const value = parsed as Record<string, unknown>;
  assertPerson(value.originator, "originator");
  assertPerson(value.beneficiary, "beneficiary");
  for (const field of ["asset", "amount", "transactionId", "timestamp"] as const) {
    if (typeof value[field] !== "string" || value[field] === "") throw new Error(`Invalid IVMS101 ${field}`);
  }
  return {
    originator: value.originator,
    beneficiary: value.beneficiary,
    asset: value.asset,
    amount: value.amount,
    transactionId: value.transactionId,
    timestamp: value.timestamp,
  };
}
