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

import { apiFetch } from "../../../../../lib/api/client";
import type {
  ConfigurationConfiguratorDTO,
} from "../models/COnfigurationConfiguratorDTO";

/* ======================================================
   UPDATE CONFIGURATION (DRAFT SAVE)
   ====================================================== */

/**
 * PUT /api/configuration/:configurationId
 *
 * Salva aggiornamenti parziali della configuration.
 *
 * USO:
 * - StepReview
 * - Handoff configurator → workspace
 *
 * NOTE:
 * - payload è intenzionalmente `unknown`
 * - validazione e merge sono responsabilità BE
 */
export async function updateConfiguration(
  configurationId: string,
  payload: unknown
): Promise<{ ok: true }> {
  const res = await apiFetch<{ ok: true }>(
    `/api/configuration/${configurationId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

  if (!res) {
    throw new Error("Invalid configuration update response");
  }

  return res;
}

/* ======================================================
   UPSERT FROM BUSINESS (BUYFLOW BRIDGE)
   ====================================================== */

/**
 * POST /api/configuration/from-business
 *
 * Crea o aggiorna una configuration partendo da un Business.
 *
 * USO:
 * - flusso buyflow
 * - post creazione business
 *
 * NOTE:
 * - Non usato direttamente dal configurator
 * - Backend decide se creare o aggiornare
 */
export async function upsertConfigurationFromBusiness(input: {
  businessId: string;
  productId: string;
  optionIds: string[];

  /**
   * FUTURO:
   * - verranno persistiti come parte del dominio Business
   * - o come metadata Configuration
   */
  businessDescriptionTags?: string[];
  businessServiceTags?: string[];
}) {
  return apiFetch<{
    ok: true;
    configurationId: string;
  }>("/api/configuration/from-business", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

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
  items: ConfigurationConfiguratorDTO[];
}> {
  const res = await apiFetch<{
    ok: true;
    items: ConfigurationConfiguratorDTO[];
  }>("/api/configuration", {
    method: "GET",
  });

  if (!res) {
    throw new Error("API /api/configuration returned null");
  }

  return res;
}

/* ======================================================
   LOAD CONFIGURATION (CONFIGURATOR / WORKSPACE)
   ====================================================== */

/**
 * GET /api/configuration/:id
 *
 * Carica una configuration esistente.
 *
 * USO:
 * - entry point configurator
 * - workspace
 *
 * NOTE:
 * - DTO minimo
 * - campi extra ignorati dal FE
 */
export async function getConfigurationForConfigurator(
  configurationId: string
): Promise<{
  ok: true;
  configuration: ConfigurationConfiguratorDTO;
}> {
  const res = await apiFetch<{
    ok: true;
    configuration: ConfigurationConfiguratorDTO;
  }>(`/api/configuration/${configurationId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res) {
    throw new Error("Configuration not found");
  }

  return res;
}

/* ======================================================
   FUTURE EXTENSIONS (DOCUMENTATE)
   ====================================================== */

/**
 * TODO (NON IMPLEMENTATO):
 *
 * - Persistenza esplicita:
 *   • solutionDescriptionTags
 *   • solutionServiceTags
 *
 * Possibili strade:
 * 1) endpoint dedicato (/configuration/:id/tags)
 * 2) merge automatico lato BE
 * 3) migrazione nel dominio Business
 *
 * Decisione rimandata volutamente.
 */
