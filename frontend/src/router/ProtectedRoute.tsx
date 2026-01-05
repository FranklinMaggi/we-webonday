// ======================================================
// FE || router/ProtectedRoute.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER AUTH GUARD
//
// RUOLO:
// - Proteggere TUTTE le route /user
//
// INVARIANTI:
// - Nessun redirect se lo stato auth non è pronto
// - Redirect a /user/login con redirect param
//
// ======================================================

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const location = useLocation();

  // ⏳ attesa bootstrap auth
  if (!ready) {
    return null; // oppure loader globale
  }

  // 🔒 non loggato → login
  if (!user) {
    const redirect = encodeURIComponent(location.pathname);
    return <Navigate to={`/user/login?redirect=${redirect}`} replace />;
  }

  // ✅ loggato
  return children ? <>{children}</> : <Outlet />;
}
