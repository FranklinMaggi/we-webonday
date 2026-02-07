// ======================================================
// FE || HOOK || useMyBusinesses (CONFIGURATION-DRIVEN)
// File: src/user/pages/dashboard/configurator/api/useMyBusinessDrafts.ts
// ======================================================
//
// SOURCE OF TRUTH:
// - configuration.complete === true
//
// RESPONSABILITÀ:
// - Restituire SOLO business navigabili (sidebar BUSINESS)
// - Arricchimento con businessName (best-effort)
//
// ======================================================
// INVARIANTE FE:
// - Un Business è navigabile SOLO se configuration.complete === true
// - Nessun fallback, nessuna eccezione
import { useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@shared/lib/api";
import { useMyConfigurations } from
  "../../api/configuration.my-configuration-get-list";

type BusinessVM = {
  configurationId: string;
  businessName: string;
};

export function useMyBusinesses() {
  const { items: configurations = [], loading: cfgLoading } =
    useMyConfigurations();

  const [businesses, setBusinesses] = useState<BusinessVM[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     CONFIGURATION COMPLETE IDS
  ========================= */
  const completeConfigs = useMemo(
    () => configurations.filter((c) => c.complete === true),
    [configurations]
  );

  const completeIdsSignature = useMemo(() => {
    return completeConfigs
      .map((c) => c.id)
      .sort()
      .join("|");
  }, [completeConfigs]);

  const lastSigRef = useRef<string>("");

  /* =========================
     FETCH BUSINESS DATA
  ========================= */
  useEffect(() => {
    if (cfgLoading) return;

    if (!completeIdsSignature) {
      setBusinesses([]);
      setLoading(false);
      lastSigRef.current = "";
      return;
    }

    if (lastSigRef.current === completeIdsSignature) return;
    lastSigRef.current = completeIdsSignature;

    let alive = true;
    setLoading(true);

    (async () => {
      try {
        const responses = await Promise.all(
          completeConfigs.map(async (c) => {
            try {
              const res = await apiFetch<{
                ok: boolean;
                draft?: any;
              }>(
                `/api/business/get?configurationId=${c.id}`
              );

              const businessName =
                res?.ok && res.draft?.businessName
                  ? res.draft.businessName
                  : c.display?.businessName ?? "Attività";

              return {
                configurationId: c.id,
                businessName,
              } as BusinessVM;
            } catch {
              return {
                configurationId: c.id,
                businessName:
                  c.display?.businessName ?? "Attività",
              } as BusinessVM;
            }
          })
        );

        if (!alive) return;
        setBusinesses(responses);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [cfgLoading, completeIdsSignature, completeConfigs]);

  return {
    businesses,
    loading,
    hasBusinesses: businesses.length > 0,
  };
}