import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export default function UserGuard({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  // ⛔️ Aspetta bootstrap auth
  if (!ready) return null;

  // ⛔️ Non loggato
  if (!user) {
    return <Navigate to="/user/login?redirect=/user/checkout" replace />;
  }

  // ✅ OK
  return <>{children}</>;
}
