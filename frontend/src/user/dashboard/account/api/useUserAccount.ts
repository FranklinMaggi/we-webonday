import { useEffect, useState } from "react";
import { apiFetch } from "@shared/lib/api";

export type UserAccountDTO = {
  id: string;
  email: string;
  membershipLevel: string;
  legal: {
    privacy: {
      accepted: boolean;
      version: string;
      acceptedAt: string;
    };
  };
  authProviders?: {
    provider: "password" | "google" | "apple";
    providerUserId: string;
  }[];
};

export function useUserAccount() {
  const [user, setUser] = useState<UserAccountDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ ok: boolean; user?: UserAccountDTO }>(
      "/api/user/me"
    )
      .then((res) => {
        if (res?.ok && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
