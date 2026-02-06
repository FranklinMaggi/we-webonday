import type { SidebarBusinessStatus } from "@src/user/dashboard/api/types/sidebarLinkViewModel.types";

import { useOwnerProfile } from "@src/user/dashboard/you/profile/api/owner/read/useOwnerProfile";
/**
 * OWNER SIDEBAR ITEM (CANONICAL)
 *
 * REGOLA:
 * - Owner è UNICO per utente
 * - NON dipende dalle configuration
 * - Stato = owner.verification (BE source of truth)
 */
export function useSidebarOwner() {
  const { owner, verification, loading } = useOwnerProfile();
  console.log("SIDEBAR OWNER", { owner, loading });
  // ❌ PRIMA: if (!owner) return [];
  // ✅ ORA: nascondi SOLO se hai CERTEZZA che non esiste
  if (!owner && !loading) return [];

  const status: SidebarBusinessStatus =
    verification === "ACCEPTED"
      ? "ACCEPTED"
      : verification === "REJECTED"
      ? "REJECTED"
      : "PENDING";

  return [
    {
      to: "/user/dashboard/you/profile",
      labelKey: "sidebar.profile.owner",
      status,
    },
  ];
}

