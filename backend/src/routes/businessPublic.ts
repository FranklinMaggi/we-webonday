import type { Env } from "../types/env";
import { BusinessSchema } from "../schemas/business/businessSchema";
import { normalizeBusiness } from "../normalizers/normalizeBusiness";
import { normalizeBusinessPublic } from "../normalizers/normalizeBusinessPublic";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * GET /api/business/public/:id
 * Espone SOLO dati pubblici di un business attivo
 */
export async function getBusinessPublic(
  request: Request,
  env: Env
) {
  const id = new URL(request.url).pathname.split("/").pop();
  if (!id) {
    return json({ error: "Missing businessId" }, 400);
  }

  const raw = await env.BUSINESS_KV.get(`BUSINESS:${id}`);
  if (!raw) {
    return json({ error: "Business not found" }, 404);
  }

  // 1️⃣ Validazione dominio (source of truth)
  const parsed = BusinessSchema.parse(JSON.parse(raw));

  // 2️⃣ Guard pubblico
  if (parsed.status !== "active") {
    return json({ error: "Business not active" }, 403);
  }

  // 3️⃣ Normalization pipeline
  const businessDTO = normalizeBusiness(parsed);
  const publicDTO = normalizeBusinessPublic(businessDTO);

  return json({
    ok: true,
    business: publicDTO,
  });
}
