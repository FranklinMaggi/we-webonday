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
import { apiFetch } from "../../../../../../shared/lib/api";

/* ======================================================
   DTO — RESPONSE
====================================================== */
export type OwnerDraftReadResponse = {
  ok: true;
  ownerDraft: {
    id: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    contact?: {
      secondaryMail?: string;
    };
    privacy: {
      accepted: boolean;
      acceptedAt: string;
      policyVersion: string;
    };
    complete: boolean;
  };
};

/* ======================================================
   HOOK
====================================================== */
export function useMyOwnerDraft(configurationId?: string) {
  const [data, setData] =
    useState<OwnerDraftReadResponse["ownerDraft"] | null>(null);

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

    (async () => {
      try {
        const res = await apiFetch<OwnerDraftReadResponse>(
          `/api/business/owner-draft?configurationId=${configurationId}`,
          { method: "GET" }
        );

        if (!alive) return;

        if (res?.ok && res.ownerDraft) {
          setData(res.ownerDraft);
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
    isComplete: data?.complete === true,
    hasDraft: !!data,
  };
}
