// ======================================================
// FE || WORKSPACE PREVIEW — CONTAINER (IDEMPOTENTE)
// ======================================================

import { useMemo } from "react";
import { useWorkspaceState } from "../workspace/workspace.state";
import { useConfigurationPreview } from "./useConfigurationPreview";

import { buildCanvas } from
  "@src/user/site-engine/engine/builder/buildCanvas";
import SiteView from "./view/SiteView";

import { AVAILABLE_LAYOUTS } from "../engine/api/types/layouts.mock";
import { adaptFrontendPreviewInput } from
  "../engine/api/adapFrontendPreviewInput";
import {
  normalizeLayoutStyle,
  normalizePalette,
} from "./site.normalizer";

export default function EntryPointSitePreview() {
  const { activeConfigurationId } = useWorkspaceState();

  // =====================
  // BE PREVIEW (SE ESISTE)
  // =====================
  const { data, loading, error } =
    useConfigurationPreview(activeConfigurationId);

  // =====================
  // CANVAS RESOLUTION
  // =====================
  const canvas = useMemo(() => {
    if (!activeConfigurationId) return null;

    /**
     * 1️⃣ PRIORITÀ ASSOLUTA: BE
     * (quando l’endpoint esisterà)
     */
    if (data) {
      return buildCanvas(data);
    }

    /**
     * 2️⃣ FALLBACK FE (PRIMITIVO)
     * - Nessuna dipendenza BE
     * - Deterministico
     * - Non bloccante
     */
    const engineInput = adaptFrontendPreviewInput({
      configurationId: activeConfigurationId,
      business: {
        name: "Anteprima attività",
        sector: "generic",
        address: "—",
      },
      layout: AVAILABLE_LAYOUTS[0],
      style: normalizeLayoutStyle(),
      palette: normalizePalette(),
    });

    return buildCanvas(engineInput);
  }, [activeConfigurationId, data]);

  // =====================
  // UI GUARDS
  // =====================
  if (!activeConfigurationId) {
    return (
      <div className="workspace-preview-empty">
        <h3>Nessuna configurazione selezionata</h3>
      </div>
    );
  }

  /**
   * Loading SOLO se:
   * - stiamo aspettando il BE
   * - e non abbiamo ancora dati
   */
  if (loading && !data) {
    return (
      <div className="workspace-preview-loading">
        Caricamento…
      </div>
    );
  }

  /**
   * Error BE:
   * - NON blocca la preview
   * - viene ignorato se FE fallback attivo
   */
  if (error && !canvas) {
    return (
      <div className="workspace-preview-error">
        {error}
      </div>
    );
  }

  if (!canvas) return null;

  return <SiteView canvas={canvas} />;
}
