// ======================================================
// FE || WORKSPACE PREVIEW — CONFIGURATION LOADER
// ======================================================

import { useEffect, useState } from "react";
import type { EngineInput } from
  "@src/user/site-preview/api/types/engine.types";
import { apiFetch } from "@shared/lib/api";

export function useConfigurationPreview(
  configurationId: string | null
) {
  const [data, setData] = useState<EngineInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configurationId) return;

    setLoading(true);
    setError(null);

    apiFetch<EngineInput>(
      `/api/configuration/${configurationId}/preview`
    )
      .then(setData)
      .catch(() =>
        setError("Errore caricamento anteprima")
      )
      .finally(() => setLoading(false));
  }, [configurationId]);

  return { data, loading, error };
}