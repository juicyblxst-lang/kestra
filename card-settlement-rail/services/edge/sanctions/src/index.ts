import { Hono } from "hono";
import { loadSanctionsFixture, screenSubject, type ScreeningSubject } from "../../../../packages/compliance/src/index";

const app = new Hono();
const index = loadSanctionsFixture();

app.get("/health", (c) => c.json({ ok: true, service: "sanctions" }));

app.post("/screen", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "INVALID_JSON" }, 400);
  }

  if (!body || typeof body !== "object" || typeof (body as Record<string, unknown>).name !== "string") {
    return c.json({ error: "INVALID_SUBJECT", message: "name is required" }, 400);
  }

  const value = body as Record<string, unknown>;
  const subject: ScreeningSubject = {
    name: value.name as string,
    ...(typeof value.dob === "string" ? { dob: value.dob } : {}),
    ...(typeof value.country === "string" ? { country: value.country } : {}),
  };
  const result = screenSubject(subject, index);

  return c.json({
    hit: result.hit,
    score: Number(result.score.toFixed(6)),
    list: result.list,
    entity: result.entity,
  });
});

export default app;
