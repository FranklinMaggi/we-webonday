import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export function ProtectedRoute() {
  const { user, ready } = useAuthStore();

  if (!ready) {
    return null; // oppure loader
  }

  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  return <Outlet />;
}
