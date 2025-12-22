import { useEffect } from "react";
import { currentUserStore } from "../lib/currentUserStore";

export function useCurrentUser() {
  const { user, loading, fetchUser } = currentUserStore();

  useEffect(() => {
    if (loading) {
      fetchUser();
    }
  }, [loading, fetchUser]);

  return { user, loading };
}
