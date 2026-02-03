// ======================================================
// FE || PREVIEW || useConfigurationPreview
// PATH: src/user/workspace/site-preview/useConfigurationPreview.ts
// ======================================================
//
// RUOLO:
// - Caricare la PREVIEW di una Configuration
// - Read-only
// - Nessuna mutazione
//
// INVARIANTI:
// - Usa SOLO configurationId
// - Usa apiFetch (standard WebOnDay)
// - Ritorna dati sempre null-safe
// ======================================================

import { useEffect, useState } from "react";

import { apiFetch } from "@src/shared/lib/api";
import type { ConfigurationPreviewDTO } from "./configurationPreview.dto";

export function useConfigurationPreview(
  configurationId?: string
) {
  const [preview, setPreview] =
    useState<ConfigurationPreviewDTO | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configurationId) {
      setPreview(null);
      return;
    }

    let alive = true;

    setLoading(true);
    setError(null);

    apiFetch<ConfigurationPreviewDTO>(
      `/api/configuration/${configurationId}/preview`
    )
      .then((data) => {
        if (!alive) return;
        setPreview(data);
      })
      .catch(() => {
        if (!alive) return;
        setError("Errore caricamento anteprima");
        setPreview(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [configurationId]);

  return {
    preview,
    loading,
    error,
  };
}