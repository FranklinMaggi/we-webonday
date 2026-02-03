/**
 * AI-SUPERCOMMENT — COOKIE CONSENT (AGGREGATED)
 *
 * RUOLO:
 * - Raccogliere statistiche aggregate sul consenso cookie
 *
 * COSA FA:
 * - NON crea cookie
 * - NON associa consenso a visitorId
 * - NON influenza autenticazione o sessione
 *
 * PERCHÉ:
 * - GDPR: consenso solo informativo
 * - Nessun profiling utente
 * - Nessun tracciamento individuale
 *
 * STORAGE:
 * - KV aggregata per giorno (COOKIE_STATS:YYYY-MM-DD)
 *
 * NOTA CRITICA:
 * - Questo endpoint NON deve mai bloccare il flusso utente
 */

import type { Env } from "../../../types/env";

/* =========================
   DOMAIN JSON HELPER
   (NO CORS, NO SIDE EFFECT)
========================= */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/* =========================
   TYPES
========================= */
type CookieEventPayload = {
  analytics: boolean;
  marketing: boolean;
};

/* =========================
   POST /api/cookies/accept
   → LOG AGGREGATO
========================= */
export async function acceptCookies(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "METHOD_NOT_ALLOWED" }, 405);
  }

  let payload: CookieEventPayload;
  try {
    payload = (await request.json()) as CookieEventPayload;
  } catch {
    return json({ error: "INVALID_JSON_BODY" }, 400);
  }

  const today = new Date().toISOString().slice(0, 10);
  const key = `COOKIE_STATS:${today}`;

  const raw = await env.COOKIES_KV.get(key);
  const stats = raw
    ? JSON.parse(raw)
    : {
        accepted: 0,
        rejected: 0,
        analyticsOn: 0,
        marketingOn: 0,
      };

  // evento: accettazione / rifiuto
  if (payload.analytics || payload.marketing) {
    stats.accepted++;
  } else {
    stats.rejected++;
  }

  if (payload.analytics) stats.analyticsOn++;
  if (payload.marketing) stats.marketingOn++;

  await env.COOKIES_KV.put(key, JSON.stringify(stats));

  return json({ ok: true });
}

/* =========================
   GET /api/cookies/status
   → STATO DEFAULT (NO PROFILING)
========================= */
export async function getCookieStatus(): Promise<Response> {
  return json({
    necessary: true,
    analytics: false,
    marketing: false,
  });
}
