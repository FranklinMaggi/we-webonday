// ======================================================
// FE || HOOK || useMyOwnerDraft
// ======================================================
//
// RUOLO:
// - Legge OwnerDraft legato a una Configuration
// - Espone SOLO dati FE-safe
//
// INVARIANTI:
// - configurationId obbligatorio
// - Backend = source of truth
// - Idempotente
// ======================================================

import { useEffect, useState } from "react";
import { apiFetch } from "../../../../shared/lib/api";
import { type OwnerReadResponse } from "../DataTransferObject/owner-draft.output.dto";
/* ======================================================
   HOOK
====================================================== */
export function useMyOwnerDraft(configurationId?: string) {
  const [data, setData] =
    useState<OwnerReadResponse["owner"] | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configurationId) {
      setData(null);
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    setError(null);

    /** `/api/owner/get?configurationId=${configurationId}` è dipendnenza del BE , 
     * associa attualmente una configuration a un owner, ma in futuro potrebbe essere 
     * più complesso (es: più owner per conf, owner non direttamente legato a conf, etc).
     * attualmnte in BE owner viene caricato da KV usando userId, e fetchato automaticamente per configurationId, 
     * ma in futuro potrebbe essere necessario passare altri parametri o fare fetch più complessi
    */
    (async () => {
      try {
        const res = await apiFetch<OwnerReadResponse>(
          `/api/owner/get?configurationId=${configurationId}`,
          { method: "GET" }
        );

        if (!alive) return;

        if (res?.ok && res.owner) {
          setData(res.owner);
        } else {
          setData(null);
        }
      } catch (err) {
        if (!alive) return;
        setError("OWNER_DRAFT_FETCH_FAILED");
        setData(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [configurationId]);

  return {
    data,
    loading,
    error,
    hasDraft: !!data,
  };
}
