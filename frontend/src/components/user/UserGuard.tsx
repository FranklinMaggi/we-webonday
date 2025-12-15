import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export default function UserGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useCurrentUser();

  if (loading) return <p>Caricamento…</p>;

  if (!user) {
    return <Navigate to="/user/login?redirect=/user/checkout" replace />;
  }

  return <>{children}</>;
}
