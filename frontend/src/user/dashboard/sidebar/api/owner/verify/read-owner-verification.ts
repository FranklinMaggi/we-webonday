import { useOwnerProfile } from "../read/useOwnerProfile";
import type { SidebarBusinessStatus } from
  "@src/user/dashboard/api/types/sidebarLinkViewModel.types";

export function useOwnerVerificationStatus(): {
  status: SidebarBusinessStatus;
  canStartVerification: boolean;
} {
  const owner = useOwnerProfile();

  if (!owner) {
    return {
      status: "PENDING",
      canStartVerification: false,
    };
  }

  switch (owner.verification) {
    case "DRAFT":
      return { status: "PENDING", canStartVerification: true };

    case "PENDING":
      return { status: "PENDING", canStartVerification: false };

    case "ACCEPTED":
      return { status: "ACCEPTED", canStartVerification: false };

    case "REJECTED":
      return { status: "REJECTED", canStartVerification: true };
  }
}
