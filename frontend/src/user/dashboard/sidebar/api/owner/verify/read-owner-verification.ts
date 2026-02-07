
import {type  OwnerVerificationUIStatus } from "../../types/owner.verification.type";
import { useOwnerProfile } from "@src/user/dashboard/profile/api/owner/read/useOwnerProfile";
export function useOwnerVerificationStatus(): {
  status: OwnerVerificationUIStatus;
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
      return { status: "DRAFT", canStartVerification: true };

    case "PENDING":
      return { status: "PENDING", canStartVerification: false };

    case "ACCEPTED":
      return { status: "ACCEPTED", canStartVerification: false };

    case "REJECTED":
      return { status: "REJECTED", canStartVerification: true };
  }
}
