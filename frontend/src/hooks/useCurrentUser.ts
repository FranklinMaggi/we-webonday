// frontend/src/hooks/useCurrentUser.ts
import { useEffect, useState } from "react";
import { API_BASE } from "../lib/config";

export interface CurrentUser {
  id: string;
  email?: string;
  googleId?: string;
  createdAt?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `${API_BASE}/api/user/me`,
          {
            credentials: "include",
          }
        );

        const out = await res.json();

        if (!cancelled) {
          setUser(out.user ?? null);
        }
      } catch (err) {
        console.error("Errore /api/user/me", err);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}
