/**
 * AI-SUPERCOMMENT — API CLIENT
 *
 * RUOLO:
 * - Unico wrapper FE → BE
 *
 * INVARIANTI:
 * - Non gestisce auth
 * - Non persiste stato
 * - Non assume presenza di cookie
 */

import { API_BASE } from "./config";

if (!API_BASE) {
  console.warn("ATTENZIONE: API_BASE non definita");
}

/* =========================
   FETCH WRAPPER
========================= */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // solo per auth/session
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API ${res.status}: ${msg}`);
  }

  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
/**
 * AI-SUPERCOMMENT — COOKIE CONSENT (FE)
 *
 * RUOLO:
 * - Invia evento di consenso
 *
 * NOTE:
 * - Best effort
 * - Errori NON bloccanti
 */

export async function acceptCookies(
  analytics: boolean,
  marketing: boolean
) {
  try {
    return await apiFetch("/api/cookies/accept", {
      method: "POST",
      body: JSON.stringify({ analytics, marketing }),
    });
  } catch (err) {
    console.warn("[cookies] accept failed (ignored)", err);
    return null;
  }
}

export function getCookieStatus() {
  return apiFetch("/api/cookies/status");
}
