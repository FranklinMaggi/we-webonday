
/* ======================================================
   LOAD CONFIGURATION (CONFIGURATOR / WORKSPACE)
   ====================================================== */
import { type ConfigurationBaseReadDTO } from "./type/ConfigurationBaseReadDTO";
import { apiFetch } from "@src/shared/lib/api";
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
export async function getPreConfiguration(
    configurationId: string
  ): Promise<{
    ok: true;
    configuration: ConfigurationBaseReadDTO;
  }> {
    const res = await apiFetch<{
      ok: true;
      configuration: ConfigurationBaseReadDTO;
    }>(`/api/configuration/read-base/${configurationId}`, {
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
  