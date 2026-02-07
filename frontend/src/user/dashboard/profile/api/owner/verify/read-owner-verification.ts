import { useOwnerProfile } from "../read/useOwnerProfile";
import type { SidebarVerificationStatus } from "@src/user/dashboard/sidebar/api/types/sidebarViewModel";



export function useOwnerVerificationStatus(): {
  verification: SidebarVerificationStatus;
  canStartVerification: boolean;
} {
  const { owner, verification } = useOwnerProfile();

  /* =====================
     NO OWNER
  ====================== */
  if (!owner) {
    return {
      verification: "PENDING",
      canStartVerification: false,
    };
  }

  /* =====================
     NORMALIZE STATUS
  ====================== */
  switch (verification) {
    case "DRAFT":
      return {
        verification: "PENDING",
        canStartVerification: true,
      };

    case "PENDING":
      return {
        verification: "PENDING",
        canStartVerification: true,
      };

    case "ACCEPTED":
      return {
        verification: "ACCEPTED",
        canStartVerification: false,
      };

    case "REJECTED":
      return {
        verification: "REJECTED",
        canStartVerification: true,
      };

    /* =====================
       SAFETY NET
    ====================== */
    default:
      return {
        verification: "PENDING",
        canStartVerification: false,
      };
  }
}
