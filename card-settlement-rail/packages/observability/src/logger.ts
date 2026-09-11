import pino, { type Logger } from "pino";

const sensitive = [
  "req.headers.authorization", "headers.authorization", "authorization", "cookie",
  "password", "token", "accessToken", "refreshToken", "apiKey", "secret",
  "pan", "cardNumber", "card_number", "cvv", "cvc", "cid", "securityCode", "security_code",
  "email", "phone", "address", "dob",
];

export function createLogger(options: pino.LoggerOptions = {}): Logger {
  return pino({
    level: process.env.LOG_LEVEL ?? "info",
    ...options,
    redact: { paths: sensitive, censor: "[REDACTED]", remove: false },
  });
}

export const logger = createLogger();
