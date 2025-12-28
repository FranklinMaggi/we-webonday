import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminToken } from "../../lib/adminApi";

/**
 * AdminGuard
 * - Unico punto di verità per accesso admin
 * - Usa SOLO sessionStorage
 * - Niente fetch, niente cookie
 */
export default function AdminGuard() {
  const token = getAdminToken();
  const location = useLocation();

  if (!token) {
  
    return <Navigate to={`/admin/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <Outlet />;
}
