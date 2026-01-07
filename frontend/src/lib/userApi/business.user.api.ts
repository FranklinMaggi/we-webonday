/**
 * ======================================================
 * FE || src/lib/business.user.api.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - DORMANT (fase 1)
 *
 * RUOLO:
 * - API FE per il dominio BUSINESS lato USER
 *
 * CONTESTO:
 * - Usata da utenti autenticati che stanno
 *   creando o gestendo la propria attività
 * - Base per la futura Business Mode
 *
 * RESPONSABILITÀ:
 * - Recuperare il business associato all’utente loggato
 * - Creare una nuova attività business
 * - Caricare media/documenti (es. menu PDF)
 *
 * NON FA:
 * - NON gestisce autenticazione (session cookie già attiva)
 * - NON decide permessi o ruoli
 * - NON valida i dati di business (backend source of truth)
 * - NON gestisce stati complessi (approval, sospensione)
 *
 * INVARIANTI:
 * - L’identità utente deriva SOLO dalla sessione
 * - Nessun userId deciso o passato dal FE
 * - credentials: include su tutte le chiamate
 *
 * RELAZIONE CON BACKEND:
 * - GET  /api/business/mine
 * - POST /api/business/create
 * - POST /api/business/menu/upload
 *
 * - Il backend decide:
 *   • ownership del business
 *   • stato (draft / active / suspended)
 *   • validità dei dati caricati
 *
 * RELAZIONE CON UI:
 * - La UI lavora sempre su BusinessDTO
 * - Nessuna normalizzazione lato componente
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/userApi/business.user.api.ts
 * - Evoluzione prevista:
 *   • onboarding guidato business
 *   • gestione più attività
 *   • stato PENDING / APPROVAL
 *
 * NOTE:
 * - File volutamente conservato anche se poco usato
 * - Serve come base stabile per fase 2
 * - Backend = source of truth
 * ======================================================
 */

import { apiFetch } from "../api";
import type { BusinessDTO } from "../dto/businessDTO";

/**
 * GET /api/business/mine
 */
export async function getMyBusiness(): Promise<{
  ok: boolean;
  business: BusinessDTO | null;
}> {
  const res = await apiFetch<{
    ok: boolean;
    business: BusinessDTO | null;
  }>(`/api/business/mine`);

  if (!res) {
    throw new Error("Invalid response from /api/business/mine");
  }

  return res;
}

/**
 * POST /api/business/create
 */
export function createBusiness(payload: {
  ownerUserId: string;
  name: string;
  address: string;
  phone: string;
  openingHours?: string;
}) {
  return apiFetch<{
    ok: boolean;
    business: BusinessDTO;
  }>("/api/business/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * POST /api/business/menu/upload
 */
export function uploadBusinessMenu(
  businessId: string,
  file: File
) {
  const form = new FormData();
  form.append("file", file);

  return apiFetch<{
    ok: boolean;
    businessId: string;
    menuPdfUrl: string;
    status: "active";
  }>(`/api/business/menu/upload?businessId=${businessId}`, {
    method: "POST",
    body: form,
    headers: {}, // 👈 IMPORTANTISSIMO
  });
}  