import { useOwnerProfile } from
  "@src/user/dashboard/profile/api/owner/read/useOwnerProfile";

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

  if (!owner && !loading) return [];

  return [
    {
      to: "/user/dashboard/you/profile",
      labelKey: "sidebar.profile.owner",
      status: verification,      // ← PASS THROUGH
      disabled: verification === "REJECTED",
    },
  ];
}
