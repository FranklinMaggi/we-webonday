import type { Env } from "../types/env";

/* =========================
   HELPERS
========================= */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
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
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed" }, 405);
  }

  let payload: CookieEventPayload;
  try {
    payload = (await request.json()) as CookieEventPayload;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
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
