// ======================================================
// FE || HOOK || useMyBusinesses (STABLE + PARALLEL + ANTI-LOOP)
// File: src/user/pages/dashboard/configurator/api/useMyBusinessDrafts.ts
// ======================================================
//
// PERCHÉ:
// - Prima: N+1 chiamate sequenziali per ogni READY configuration
// - Dopo createBusinessDraft / createOwnerDraft può re-run spesso
// - Risultato: “fetch infiniti” percepiti + UI lenta
//
// FIX:
// - Dipendenza su signature stabile (ids READY)
// - Fetch in parallelo (Promise.all)
// - Guard anti re-run se signature non cambia
// ======================================================

import { useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@src/shared/lib/api";
import { useMyConfigurations } from "../../configurator/base_configuration/configuration/useMyConfigurations";

type BusinessVM = {
  configurationId: string;
  businessName: string;
  complete: boolean;
};

export function useMyBusinesses() {
  const { items: configurations = [], loading: cfgLoading } =
    useMyConfigurations();

  const [completed, setCompleted] = useState<BusinessVM[]>([]);
  const [inProgress, setInProgress] = useState<BusinessVM[]>([]);
  const [loading, setLoading] = useState(true);

  // signature stabile: se gli id READY non cambiano, non rifare fetch
  const readyIdsSignature = useMemo(() => {
    const ids = configurations
      .filter((c) => c.status === "READY")
      .map((c) => c.id)
      .sort();
    return ids.join("|");
  }, [configurations]);

  const lastSigRef = useRef<string>("");

  useEffect(() => {
    if (cfgLoading) return;

    // se non ci sono READY, reset pulito
    if (!readyIdsSignature) {
      setCompleted([]);
      setInProgress([]);
      setLoading(false);
      lastSigRef.current = "";
      return;
    }

    // anti re-run inutile
    if (lastSigRef.current === readyIdsSignature) return;
    lastSigRef.current = readyIdsSignature;

    let alive = true;
    setLoading(true);

    const readyConfigs = configurations.filter((c) => c.status === "READY");

    (async () => {
      try {
        const responses = await Promise.all(
          readyConfigs.map(async (c) => {
            const res = await apiFetch<{
              ok: boolean;
              draft?: any;
            }>(`/api/business/get-base-draft?configurationId=${c.id}`);

            if (res?.ok && res.draft) {
              const businessName =
                res.draft.businessName ??
                c.prefill?.businessName ??
                "Attività";

              return {
                configurationId: c.id,
                businessName,
                complete: Boolean(res.draft.complete),
              } as BusinessVM;
            }

            return null;
          })
        );

        if (!alive) return;

        const results = responses.filter(Boolean) as BusinessVM[];
        setCompleted(results.filter((b) => b.complete));
        setInProgress(results.filter((b) => !b.complete));
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [cfgLoading, readyIdsSignature, configurations]);

  return {
    completed,
    inProgress,
    loading,
    hasCompleted: completed.length > 0,
    hasInProgress: inProgress.length > 0,
  };
}
