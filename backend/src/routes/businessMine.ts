//businessmMine.ts
import type { Env } from "../types/env";
import { BusinessSchema } from "../schemas/business/businessSchema";
import { normalizeBusiness } from "../normalizers/normalizeBusiness";
import { requireUser } from "../lib/auth";
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * GET /api/business/mine?userId=UUID
 */
export async function getMyBusiness(request: Request, env: Env) {
    const auth = await requireUser(request, env);
    if (!auth) return json({ error: "Unauthorized" }, 401);
    
    const { userId } = auth;

  // 1️⃣ lookup diretto user → business
  const businessId = await env.BUSINESS_KV.get(`USER_BUSINESS:${userId}`);
  if (!businessId) {
    return json({ ok: true, business: null });
  }

  // 2️⃣ load business
  const stored = await env.BUSINESS_KV.get(`BUSINESS:${businessId}`);
  if (!stored) {
    return json({ ok: true, business: null });
  }

  // 3️⃣ validazione dominio
  const parsed = BusinessSchema.parse(JSON.parse(stored));

  // 4️⃣ normalizzazione output
  const business = normalizeBusiness(parsed);

  return json({ ok: true, business });
}
