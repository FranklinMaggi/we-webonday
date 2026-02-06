// ======================================================
// FE || USER DASHBOARD || PROFILE CONTAINER (CANONICAL)
// ======================================================
//
// RUOLO:
// - carica il profilo Owner dell’utente loggato
// - source of truth: BE → GET /api/owner/me
//
// INVARIANTE:
// - Profile NON dipende da configuration
// - Owner è user-scoped (1:1)
//
// ======================================================

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@src/shared/lib/api";

import type {
  OwnerReadDTO
} from "./DataTransferObject/owner.read.types";

export function useProfileContainer() {
  const [owner, setOwner] =
    useState<OwnerReadDTO | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const loadProfile = useCallback(async () => {
    setLoading(true);

    try {
      const res = await apiFetch<{
        ok: boolean;
        owner: OwnerReadDTO | null;
      }>("/api/owner/me");

      if (res?.ok) {
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
    loadProfile();
  }, [loadProfile]);

  return {
    owner,
    verification:
      owner?.verification ?? "DRAFT",
    loading,
    reloadProfile: loadProfile,
  };
}
