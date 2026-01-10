// ======================================================
// BE || routes/tenant/business/business.list.ts
// ======================================================
//
// LIST USER BUSINESSES
// GET /api/business
//
// RUOLO:
// - Ritorna la lista dei business dell’utente autenticato
// - Basata su indice KV (no scan, no join)
//
// INVARIANTI:
// - Auth hard (requireUser)
// - Read-only
// - Non carica Business completi
// ======================================================

import type { Env } from "../../../types/env";
import { requireUser } from "../../../lib/auth/session";
import { json } from "../../../lib/https";

const USER_BUSINESSES_KEY = (userId: string) =>
  `USER_BUSINESSES:${userId}`;

type BusinessSummary = {
  businessId: string;
  publicId: string;
  name: string;
  status: "draft" | "pending" | "active" | "suspended";
  createdAt: string;
};

export async function listBusinesses(
  request: Request,
  env: Env
): Promise<Response> {
  const session = await requireUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const raw = await env.BUSINESS_KV.get(
    USER_BUSINESSES_KEY(session.user.id),
    "json"
  );

  const items: BusinessSummary[] = Array.isArray(raw)
    ? raw
    : [];

  return json({ ok: true, items }, request, env);
}
