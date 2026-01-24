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
/**
 * ======================================================
 * FE || src/lib/client.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE
 *
 * RUOLO:
 * - Wrapper fetch GENERICO per FE → Backend
 *
 * RESPONSABILITÀ:
 * - Costruire richieste HTTP verso API_BASE
 * - Impostare header JSON di default
 * - Gestire credentials (session cookie)
 * - Normalizzare errori HTTP in Error JS
 *
 * NON FA:
 * - NON gestisce autenticazione (user o admin)
 * - NON persiste stato
 * - NON interpreta risposte di dominio
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/api/client.ts
 * - Motivo:
 *   Questo file diventerà l’UNICO entry point fetch
 *   per TUTTE le API FE (admin, user, object).
 *   Le varianti (adminFetch, userFetch, ecc.)
 *   saranno adapter sopra questo client.
 * * ⚠️ NOTA DI CONTRATTO:
 * - apiFetch può restituire null
 * - Le API di dominio DEVONO assorbire il null
 *   e NON propagarlo alla UI, salvo casi espliciti
 * NOTE:
 * - Backend = source of truth
 * - Questo file NON deve contenere logica di dominio
 * ======================================================
 */

import { API_BASE } from "../config";

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
