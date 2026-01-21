// ======================================================
// BE || routes/tenant/business/business.get.ts
// ======================================================
//
// GET BUSINESS (TENANT)
// GET /api/business/:id
//
// RUOLO:
// - Ritorna un singolo business dell’utente
// - Hard auth + ownership check
//
// INVARIANTI:
// - user da sessione
// - businessId da URL
// - ownerUserId deve combaciare
// ======================================================

import type { Env } from "../../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { BUSINESS_KEY } from "../../../../lib/kv";
import { BusinessSchema } from "../../schema/business.schema";
import { json } from "../../../auth/route/helper/https";

export async function getBusiness(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1) AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const user = session.user;

  /* =====================
     2) EXTRACT ID
  ====================== */
  const id = request.url.split("/").pop();
  if (!id) {
    return json({ ok: false, error: "MISSING_BUSINESS_ID" }, request, env, 400);
  }

  /* =====================
     3) LOAD BUSINESS
  ====================== */
  const raw = await env.BUSINESS_KV.get(BUSINESS_KEY(id));
  if (!raw) {
    return json({ ok: false, error: "BUSINESS_NOT_FOUND" }, request, env, 404);
  }

  /* =====================
     4) VALIDATE
  ====================== */
  let business;
  try {
    business = BusinessSchema.parse(JSON.parse(raw));
  } catch {
    return json({ ok: false, error: "CORRUPTED_BUSINESS_DATA" }, request, env, 500);
  }

  /* =====================
     5) OWNERSHIP
  ====================== */
  if (business.ownerUserId !== user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  /* =====================
     6) RESPONSE
  ====================== */
  return json({ ok: true, business }, request, env);
}
