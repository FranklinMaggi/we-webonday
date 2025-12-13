import { useEffect, useState } from "react";

export interface WebondayUser {
  id: string;
  email: string;
  googleId?: string;
  createdAt: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<WebondayUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          {
            credentials: "include",
          }
        );

        const out = await res.json();
        if (!cancelled) {
          if (out.ok && out.user) {
            setUser(out.user);
          } else {
            setUser(null);
          }
        }
      } catch {
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
