// Account.container.ts
// ======================================================
// FE || USER DASHBOARD || ACCOUNT — CONTAINER
// ======================================================

import { useUserAccount } from "./api/useUserAccount";

export type AccountVM = {
  userId: string;
  email: string;
  provider: "password" | "google" | "apple" | "unknown";
  privacyAccepted: boolean;
};

export function useAccountContainer(): AccountVM | null {
  const { user, loading } = useUserAccount();

  if (loading || !user) return null;

  const provider =
    user.authProviders?.[0]?.provider ?? "unknown";

  return {
    userId: user.id,
    email: user.email,
    provider,
    privacyAccepted: user.legal?.privacy?.accepted ?? false,
  };
}
