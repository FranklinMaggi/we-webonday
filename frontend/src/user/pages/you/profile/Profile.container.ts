// ======================================================
// FE || USER DASHBOARD || PROFILE — CONTAINER
// ======================================================
//
// SOURCE OF TRUTH:
// - USER / OWNER (no configuration)
// - endpoint: /api/owner/get-draft
//
// RUOLO:
// - read-only profile
// - no side effects
// ======================================================

import { useEffect, useState } from "react";
import { apiFetch } from "@src/shared/lib/api";

type OwnerProfileDTO = {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  contact?: {
    secondaryMail?: string;
  };
  privacy?: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };
  verified?: boolean;
  complete?: boolean;
  createdAt?: string;
};

export function useProfileContainer() {
  const [user, setUser] = useState<OwnerProfileDTO | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const res = await apiFetch<{
          ok: boolean;
          owner?: OwnerProfileDTO;
        }>("/api/owner/get-draft");

        if (!cancelled && res?.owner) {
          setUser(res.owner);
        }
      } catch {
        if (!cancelled) setUser(null);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}
