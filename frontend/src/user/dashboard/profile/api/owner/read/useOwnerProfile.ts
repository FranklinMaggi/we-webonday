// ======================================================
// FE || OWNER || PROFILE || HOOK (CANONICAL)
// ======================================================
//
// RUOLO:
// - Espone il profilo Owner (1:1 con user)
// - Source of truth: BE → GET /api/owner/me
//
// INVARIANTI:
// - Nessuna derivazione da Configuration
// - Nessun fallback inventato
// - Firma STABILE (legacy-safe)
//
// ======================================================

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@shared/lib/api";

import type {
  OwnerReadDTO,
  OwnerVerification, }  from "../../../DataTransferObject/owner.read.types";

export function useOwnerProfile(): {
  owner: OwnerReadDTO | null;
  verification: OwnerVerification;
  isReady: boolean;
  loading: boolean;        
  reload: () => Promise<void>;
} {
  const [owner, setOwner] =
    useState<OwnerReadDTO | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const res = await apiFetch<{
        ok: boolean;
        owner: OwnerReadDTO | null;
      }>("/api/owner/me", { method: "GET" });

      if (res?.ok === true) {
        setOwner(res.owner ?? null);
      } else {
        setOwner(null);
      }
    } catch {
      setOwner(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const verification: OwnerVerification =
    owner?.verification ?? "DRAFT";

    return {
      owner,
      verification,
      isReady:
        verification === "ACCEPTED" && !loading,
      loading,                     // ✅ ESPORTATO
      reload: load,
    };
}
