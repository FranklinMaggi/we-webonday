import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminToken } from "../../pages/admin/utils/adminToken";

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
    const next = encodeURIComponent(location.pathname);
    return <Navigate to={`/admin/login?next=${next}`} replace />;
  }

  return <Outlet />;
}
