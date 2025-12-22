import type { Env } from "../types/env";
import { BusinessSchema } from "../schemas/business/businessSchema";
import { normalizeBusinessPublic } from "../normalizers/normalizeBusinessPublic";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function getBusinessPublic(request: Request, env: Env) {
  const id = new URL(request.url).pathname.split("/").pop();
  if (!id) return json({ error: "Missing businessId" }, 400);

  const raw = await env.BUSINESS_KV.get(`BUSINESS:${id}`);
  if (!raw) return json({ error: "Not found" }, 404);

  const parsed = BusinessSchema.parse(JSON.parse(raw));
  if (parsed.status !== "active") {
    return json({ error: "Business not active" }, 403);
  }

  return json({
    ok: true,
    business: normalizeBusinessPublic(parsed),
  });
}
