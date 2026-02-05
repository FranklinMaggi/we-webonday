/**
 * ======================================================
 * FE || CONFIGURATION USER API (CANONICAL)
 * ======================================================
 *
 * RUOLO:
 * - Bridge FE ⇄ BE per la persistenza della Configuration
 * - Usato da:
 *   • configurator (wizard)
 *   • workspace / dashboard
 *
 * DOMINIO:
 * - Configuration = workspace persistente (BE)
 * - Configurator = draft FE temporaneo (Zustand)
 *
 * SOURCE OF TRUTH:
 * - Backend
 *
 * INVARIANTI:
 * - configurationId è SEMPRE fornito dal backend
 * - FE non crea Configuration
 * - FE invia payload parziali (draft)
 *
 * NOTE ARCHITETTURALI:
 * - Questo file NON contiene logica di dominio
 * - Nessuna validazione FE
 * - Nessuna interpretazione dei dati
 *
 * FUTURO:
 * - descriptionTags / solutionTags verranno gestiti
 *   da endpoint dedicati o merge BE
 * ======================================================
 */

import { apiFetch } from "../../../../../shared/lib/api/client";
import { type ConfigurationUserSummaryDTO } from "../ConfigurationConfiguratorDTO";


/* ======================================================
   LIST USER CONFIGURATIONS
   ====================================================== */

/**
 * GET /api/configuration
 *
 * Lista delle configuration dell’utente.
 *
 * USO:
 * - dashboard
 * - workspace index
 *
 * NOTE:
 * - Usa ConfigurationConfiguratorDTO per coerenza FE
 */
export async function listMyConfigurations(): Promise<{
  ok: true;
  items: ConfigurationUserSummaryDTO[];
}> {
  const res = await apiFetch<{
    ok: true;
    items: ConfigurationUserSummaryDTO[];
  }>("/api/configuration/get-list", {
    method: "GET",
  });

  if (!res) {
    throw new Error("API /api/configuration returned null");
  }

  return res;
}
