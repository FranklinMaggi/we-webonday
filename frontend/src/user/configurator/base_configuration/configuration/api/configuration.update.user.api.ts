import { apiFetch } from "@shared/lib/api";
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
    throw new Error("CONFIGURATION_UPDATE_FAILED");
  }

  return res;
}