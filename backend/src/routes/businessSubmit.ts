import type { Env } from "../types/env";
import { BusinessSchema } from "../schemas/business/businessSchema";
import { logActivity } from "../lib/logActivity";
import { requireUser } from "../lib/auth";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * POST /api/business/submit
 * Transizione: draft → pending
 */
export async function submitBusiness(
  request: Request,
  env: Env
) {
  // 1️⃣ AUTH (centralizzato)
  const auth = await requireUser(request, env);
  if (!auth) {
    return json({ error: "Unauthorized" }, 401);
  }

  const { userId } = auth;

  // 2️⃣ Recupera business dell’utente (O(1))
  const businessId = await env.BUSINESS_KV.get(`USER_BUSINESS:${userId}`);
  if (!businessId) {
    return json({ error: "Business not found" }, 404);
  }

  const raw = await env.BUSINESS_KV.get(`BUSINESS:${businessId}`);
  if (!raw) {
    return json({ error: "Business not found" }, 404);
  }

  // 3️⃣ Validazione dominio
  const business = BusinessSchema.parse(JSON.parse(raw));

  // 4️⃣ Ownership check
  if (business.ownerUserId !== userId) {
    return json({ error: "Forbidden" }, 403);
  }

  // 5️⃣ Guard stato
  if (business.status === "pending") {
    return json({ ok: true, status: "pending", alreadySubmitted: true });
  }

  if (business.status !== "draft") {
    return json(
      { error: "Business cannot be submitted from current status" },
      409
    );
  }

  // 6️⃣ Transizione di stato
  const updatedBusiness = {
    ...business,
    status: "pending" as const,
  };

  await env.BUSINESS_KV.put(
    `BUSINESS:${businessId}`,
    JSON.stringify(updatedBusiness)
  );

  // 7️⃣ Audit log
  await logActivity(env, "BUSINESS_SUBMITTED", userId, {
    businessId,
    name: business.name,
    submittedAt: new Date().toISOString(),
  });

  return json({
    ok: true,
    businessId,
    status: "pending",
  });
}
