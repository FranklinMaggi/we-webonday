// backend/src/routes/admin/options.admin.ts
// ======================================================
// ADMIN — OPTIONS (CATALOGO GLOBALE)
// ======================================================
//
// RESPONSABILITÀ:
// - Creazione / aggiornamento option
// - KV = source of truth
// - Option = regola di pagamento (PayPal-ready)
//
// NOTE:
// - idempotente per `id`
// - createdAt solo alla prima creazione
// ======================================================

import type { Env } from "../../types/env";
import { OptionSchema } from "../../schemas/core/optionSchema";
import { requireAdmin } from "./admin.guard";

/* =========================
   JSON HELPER
========================= */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* ======================================================
   PUT /api/options/register
====================================================== */
export async function registerOption(
  request: Request,
  env: Env
): Promise<Response> {

  const guard = requireAdmin(request, env);
  if (guard) return guard;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "INVALID_JSON" }, 400);
  }

  if (!body || typeof body !== "object" || !("id" in body)) {
    return json({ ok: false, error: "MISSING_OPTION_ID" }, 400);
  }

  const now = new Date().toISOString();

  // recupero eventuale option esistente (per createdAt)
  const existingRaw = await env.OPTIONS_KV.get(
    `OPTION:${(body as any).id}`
  );

  let createdAt = now;
  if (existingRaw) {
    try {
      const existing = JSON.parse(existingRaw);
      createdAt = existing.createdAt ?? now;
    } catch {}
  }

  // VALIDAZIONE DOMINIO
  const validated = OptionSchema.parse({
    ...body,
    createdAt,
    updatedAt: now,
  });

  // UPSERT
  await env.OPTIONS_KV.put(
    `OPTION:${validated.id}`,
    JSON.stringify(validated)
  );

  return json({ ok: true, option: validated });
}
