/**
 * ======================================================
 * FE || src/lib/adminApi/client.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE
 *
 * RUOLO:
 * - Wrapper fetch dedicato alle API ADMIN
 *
 * RESPONSABILITÀ:
 * - Allegare il token admin (x-admin-token) a ogni richiesta
 * - Delegare la costruzione URL a API_BASE
 * - Gestire errori HTTP admin
 * - Forzare logout e redirect su 401 / token mancante
 *
 * NON FA:
 * - NON valida i payload (backend source of truth)
 * - NON gestisce stato applicativo
 * - NON conosce la UI che consuma le API
 *
 * RELAZIONE CON api.ts:
 * - Questo file è un ADAPTER sopra il client generico
 * - Attualmente usa fetch diretto
 * - In futuro userà api/client.ts come base comune
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/api/client.ts (come adapter admin)
 * - Motivo:
 *   Centralizzare TUTTE le chiamate HTTP in un solo
 *   client FE, mantenendo qui solo la logica
 *   specifica admin (token + redirect).
 *
 * NOTE:
 * - Backend = source of truth
 * - Ogni endpoint admin deve passare da questo file
 * - Vietato usare fetch diretto nelle adminApi
 * ======================================================
 */
import { API_BASE } from "../../shared/lib/config";
import { getAdminToken, adminLogout } from "./auth";

/**
 * Wrapper fetch per tutte le API admin
 */
export async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();

  if (!token) {
    adminLogout();
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token!,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    adminLogout();
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Admin API error");
  }

  return res.json() as Promise<T>;
}
