// ======================================================
// FE || HOOK || useMyBusinesses (CANONICAL)
// ======================================================
//
// RUOLO:
// - Deriva Business dalla Configuration
// - Business = configuration READY + businessDraft completo
//
// SOURCE OF TRUTH:
// - Configuration.status
// - BusinessDraft.complete
//
// ======================================================

import { useEffect, useState } from "react";
import { useMyConfigurations } from "./useMyConfigurations";
import { apiFetch } from "../../../../../shared/lib/api";

type BusinessVM = {
  configurationId: string;
  businessName: string;
  complete: boolean;
};

export function useMyBusinesses() {
  const { items: configurations, loading: cfgLoading } =
    useMyConfigurations();

  const [completed, setCompleted] = useState<BusinessVM[]>([]);
  const [inProgress, setInProgress] = useState<BusinessVM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cfgLoading) return;

    async function load() {
      const readyConfigs = configurations.filter(
        (c) => c.status === "READY"
      );

      const results: BusinessVM[] = [];

      for (const c of readyConfigs) {
        const res = await apiFetch<{
          ok: boolean;
          draft?: any;
        }>(
          `/api/business/get-base-draft?configurationId=${c.id}`
        );

        if (res?.ok && res.draft) {
          results.push({
            configurationId: c.id,
            businessName:
              res.draft.businessName ??
              c.prefill?.businessName ??
              "Attività",
            complete: Boolean(res.draft.complete),
          });
        }
      }

      setCompleted(results.filter((b) => b.complete));
      setInProgress(results.filter((b) => !b.complete));
      setLoading(false);
    }

    load();
  }, [configurations, cfgLoading]);

  return {
    completed,
    inProgress,
    loading,
    hasCompleted: completed.length > 0,
    hasInProgress: inProgress.length > 0,
  };
}
