import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export default function UserGuard({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  // 1️⃣ Auth non ancora risolta → NON FARE NULLA
  if (!ready) return null;

  // 2️⃣ Ready ma user NULL → davvero non loggato
  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  // 3️⃣ OK
  return <>{children}</>;
}
