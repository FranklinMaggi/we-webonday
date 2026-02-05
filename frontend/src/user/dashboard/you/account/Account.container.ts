// ======================================================
// FE || USER DASHBOARD || ACCOUNT — CONTAINER
// ======================================================

import { useAuthStore } from
  "@shared/lib/store/auth.store";

export type AccountVM = {
  userId: string;
  email: string;
  provider: "password" | "google" | "unknown";
};

export function useAccountContainer(): AccountVM | null {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return {
    userId: user.id,
    email: user.email,
    provider: "unknown", // finché BE non lo espone
  };
}
