import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export function ProtectedRoute() {
  const { user, ready } = useAuthStore();
  const location = useLocation();

  if (!ready) return null;

  if (!user) {
    const redirect = encodeURIComponent(location.pathname);
    return (
      <Navigate
        to={`/user/login?redirect=${redirect}`}
        replace
      />
    );
  }

  return <Outlet />;
}
