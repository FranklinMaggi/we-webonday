import type { Env } from "../../../types/env";

/* ======================================================
   SESSION — HARD AUTH (USER)
   ======================================================

   SOURCE OF TRUTH:
   - Cookie: webonday_session (contiene SOLO userId)
   - KV: ON_USERS_KV (USER:{userId})

   NOTE:
   - Questo file NON crea cookie.
   - Questo file NON gestisce visitor.
   - Questo file NON fa fallback automatici.
====================================================== */

/* ======================================================
   LOW LEVEL — parse cookie only
====================================================== */
export function getUserIdFromSession(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie") ?? "";

  // Match robusto: prende il valore fino a ';'
  const match = cookieHeader.match(/(?:^|;\s*)webonday_session=([^;]+)/);
  return match ? match[1] : null;
}

/* ======================================================
   MID LEVEL — load user (NOT a guard)
   ⚠️ Non usare per endpoint protetti.
====================================================== */
export async function getUserFromSession(
  request: Request,
  env: Env
): Promise<any | null> {
  const userId = getUserIdFromSession(request);
  if (!userId) return null;

  const raw = await env.ON_USERS_KV.get(`USER:${userId}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    // KV corrotto o formato inatteso -> trattiamo come sessione invalida
    return null;
  }
}


