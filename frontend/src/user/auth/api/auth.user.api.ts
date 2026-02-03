/**
 * ======================================================
 * FE || src/lib/authApi.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE (PRE-MIGRAZIONE)
 *
 * RUOLO:
 * - API FE per l’AUTENTICAZIONE USER (buyer / partner)
 * - Punto di accesso allo stato utente corrente
 *
 * RESPONSABILITÀ:
 * - Recuperare l’utente autenticato via sessione
 * - Fornire URL di login Google OAuth
 * - Eseguire logout user
 *
 * NON FA:
 * - NON gestisce token manuali
 * - NON persiste stato utente
 * - NON decide ruoli o permessi
 * - NON gestisce modalità (buyer / business)
 *
 * INVARIANTI:
 * - L’identità utente deriva ESCLUSIVAMENTE dalla sessione backend
 * - Tutte le richieste user passano da apiFetch
 * - credentials: "include" è obbligatorio
 *
 * RELAZIONE CON BACKEND:
 * - GET  /api/user/me
 * - GET  /api/user/google/auth
 * - POST /api/user/logout
 *
 * RELAZIONE CON UI:
 * - La UI riceve:
 *   • CurrentUser | null
 * - Nessuna normalizzazione UI in questo file
 * - Nessuna assunzione sulla presenza dell’utente
 *
 * RELAZIONE CON api.ts:
 * - Usa apiFetch come client HTTP base
 * - authApi NON conosce API_BASE direttamente
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/userApi/auth.user.api.ts
 * - Motivo:
 *   Separare chiaramente:
 *   • API USER
 *   • API ADMIN
 *   • API OBJECT
 *
 * NOTE:
 * - File volutamente minimale
 * - Ogni estensione (refresh, scope, roles)
 *   deve essere guidata dal backend
 * ======================================================
 */

import { apiFetch } from "../../../shared/lib/api/client";
import { API_BASE } from "../../../shared/lib/config";

export type CurrentUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await apiFetch("/api/user/me", {
      credentials: "include",
    });
  } catch (err) {
    console.warn("[authApi] getCurrentUser fallback:", err);
    return null;
  }
}

export function getGoogleLoginUrl(redirect?: string): string {
  const url = new URL(`${API_BASE}/api/user/google/auth`);
  if (redirect) url.searchParams.set("redirect", redirect);
  return url.toString();
}
export async function logout() {
  await apiFetch("/api/user/logout", { method: "POST" });
}


