/**
 * Maestro scenario source-of-truth.
 *
 * Execute with Maestro against a locally built development app when E2E is enabled.
 * Round 1 intentionally does not execute E2E.
 */
export const opsFlow = {
  appId: "com.cardsettlement.ops",
  steps: [
    { action: "launchApp" },
    { action: "assertVisible", value: "Ops console" },
    { action: "tapOn", value: "Settlements" },
    { action: "assertVisible", value: "Settlement" },
    { action: "back" },
    { action: "tapOn", value: "Alerts →" },
    { action: "assertVisible", value: "Alerts" },
    { action: "back" },
    { action: "tapOn", value: "Settings →" },
    { action: "assertVisible", value: "Settings" },
  ],
} as const;
