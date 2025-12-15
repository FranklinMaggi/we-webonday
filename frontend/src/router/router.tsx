// src/router/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import AdminLayout from "../components/layouts/AdminLayout";

/* =========================
   PAGES
========================= */

// Public
import Home from "../pages/home";
import Vision from "../pages/vision";
import Mission from "../pages/mission";

// User
import UserLogin from "../pages/user/login";
import CheckoutPage from "../pages/user/checkout";

// Policy
import Privacy from "../pages/policy/privacy";
import Terms from "../pages/policy/terms";

// Admin
import AdminLogin from "../pages/admin/utils/login";
import AdminDashboard from "../pages/admin/dashboard";
import AdminOrdersPage from "../pages/admin/orders";
import AdminOrderDetails from "../pages/admin/orders/[id]";

// SuperAdmin
import SuperAdminLayout from "../components/superadmin/AdminLayout";
import SuperAdminGuard from "../components/superadmin/AdminGuard";
import SuperAdminDashboard from "../pages/superadmin/dashboard";
import SuperAdminUsers from "../pages/superadmin/dashboard/Users";
import SuperAdminOrders from "../pages/superadmin/dashboard/Orders";
import SuperAdminLogs from "../pages/superadmin/dashboard/Logs";

const router = createBrowserRouter([
  /* =========================
     PUBLIC + USER
  ========================= */
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "vision", element: <Vision /> },
      { path: "mission", element: <Mission /> },
      { path: "user/login", element: <UserLogin /> },
      { path: "policy/privacy", element: <Privacy /> },
      { path: "policy/terms", element: <Terms /> },
    ],
  },
  
  {
    path: "/user/checkout",
    element: <CheckoutPage />,
  },
  
  /* =========================
     ADMIN
  ========================= */
  {
    path: "/admin",
    children: [
      { path: "login", element: <AdminLogin /> },
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "orders/:id", element: <AdminOrderDetails /> },
        ],
      },
    ],
  },

  /* =========================
     SUPERADMIN
  ========================= */
  {
    path: "/superadmin",
    element: (
      <SuperAdminGuard>
        <SuperAdminLayout />
      </SuperAdminGuard>
    ),
    children: [
      { path: "dashboard", element: <SuperAdminDashboard /> },
      { path: "users", element: <SuperAdminUsers /> },
      { path: "orders", element: <SuperAdminOrders /> },
      { path: "logs", element: <SuperAdminLogs /> },
    ],
  },
]);

export default router;
