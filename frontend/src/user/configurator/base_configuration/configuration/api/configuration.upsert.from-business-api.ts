/* ======================================================
   UPSERT FROM BUSINESS (BUYFLOW BRIDGE)
   ====================================================== */
import { apiFetch } from "@src/shared/lib/api";
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
  