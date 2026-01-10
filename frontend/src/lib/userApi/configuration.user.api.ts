/**
 * ======================================================
 * FE || src/lib/configuration/configuration.user.api.ts-> /lib/userAPi
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE (PRE-MIGRAZIONE)
 *
 * RUOLO:
 * - API FE per la persistenza della CONFIGURATION
 * - Salvataggio incrementale (draft) lato backend
 *
 * CONTESTO:
 * - Usata durante il flusso di configurazione prodotto
 * - Opera su una entità "Configuration" già creata
 *
 * RESPONSABILITÀ:
 * - Inviare aggiornamenti parziali della configuration
 * - Delegare al backend:
 *   • validazione
 *   • merge
 *   • persistenza
 *
 * NON FA:
 * - NON crea configuration
 * - NON valida i dati
 * - NON interpreta il contenuto del payload
 *
 * INVARIANTI:
 * - configurationId è SEMPRE fornito dal backend
 * - credentials: include (session user)
 * - Backend = source of truth
 *
 * PROBLEMA NOTO:
 * - Usa fetch diretto invece di apiFetch
 *
 * MIGRAZIONE FUTURA:
 * - Destinazione: src/lib/userApi/configuration.user.api.ts
 * - Refactor:
 *   • sostituire fetch con apiFetch
 *   • allineare gestione errori
 *
 * NOTE:
 * - File mantenuto semplice per evitare coupling
 * - Ogni evoluzione passa dal backend
 * ======================================================
 */
// ======================================================
// FE || lib/configurationApi.ts
// ======================================================
//
// CONFIGURATION API — FE ⇄ BE
//
// RUOLO:
// - Persistenza draft configurazione
//
// INVARIANTI:
// - Usa sempre configurationId
// - credentials: include


// ======================================================

import { apiFetch } from "../api/client";

/**
 * PUT /api/configuration/:configurationId
 */
export async function updateConfiguration(
  configurationId: string,
  payload: unknown
): Promise<unknown> {
  const res = await apiFetch<unknown>(
    `/api/configuration/${configurationId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

  if (res === null) {
    throw new Error("Invalid configuration update response");
  }

  return res;
}
// ======================================================
// CONFIGURATION — UPSERT FROM BUSINESS
// ======================================================

export async function upsertConfigurationFromBusiness(input: {
  businessId: string;
  productId: string;
  optionIds: string[];
}) {
  return apiFetch<{
    ok: true;
    configurationId: string;
  }>("/api/configuration/from-business", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
