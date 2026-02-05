// ======================================================
// FE || OWNER || PROFILE || HOOK
// ======================================================
//
// @deprecated
//
// ⚠️ DRAFT IMPLEMENTATION
//
// RUOLO:
// - Espone il profilo Owner (UNICO per user)
// - Fornisce stato di verifica owner
//
// STATO ATTUALE:
// - Fallback: DERIVA lo stato dalle configuration
// - NON legge ancora /api/owner/read
//
// FUTURO:
// - Questo hook diventerà SOURCE OF TRUTH
// - L’implementazione interna cambierà
// - La FIRMA NON deve cambiare
// ======================================================

import { useCallback } from "react";
import { useMyConfigurations } from
  "@src/user/configurator/base_configuration/configuration/api/configuration.my-configuration-get-list";

import type { OwnerDraftReadDTO } from
  "@src/user/dashboard/you/profile/DataTransferObject/owner.read.types";

export function useOwnerProfile(): {
  owner: OwnerDraftReadDTO | null;
  verification: "DRAFT" | "PENDING" | "ACCEPTED" | "REJECTED";
  isReady: boolean;
  reload: () => Promise<void>;
} {
  const { items = [] } = useMyConfigurations();

  /* ======================================================
     EMPTY STATE
  ====================================================== */
  if (items.length === 0) {
    return {
      owner: null,
      verification: "DRAFT",
      isReady: false,
      reload: async () => {
        /* noop — draft hook */
      },
    };
  }

  /* ======================================================
     DERIVED STATUS (BEST EFFORT)
  ====================================================== */
  const verification: "DRAFT" | "PENDING" | "ACCEPTED" | "REJECTED" =
    items.some((c) => c.status === "ACCEPTED")
      ? "ACCEPTED"
      : items.some((c) => c.status === "REJECTED")
      ? "REJECTED"
      : "PENDING";

  /* ======================================================
     OWNER (PLACEHOLDER)
     ⚠️ verrà sostituito da /api/owner/read
  ====================================================== */
  const owner: OwnerDraftReadDTO = {
    id: "TEMP_OWNER",
    firstName: "",
    lastName: "",
    source: "manual",
    ownerDraftComplete: false,
    verification,
  };

  const reload = useCallback(async () => {
    /* noop — draft hook */
  }, []);

  return {
    owner,
    verification,
    isReady: verification === "ACCEPTED",
    reload,
  };
}
