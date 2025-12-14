//router
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import AdminLayout from "../components/layouts/AdminLayout";
// Pagine principali
import Home from "../pages/home";
import Vision from "../pages/vision";
import Mission from "../pages/mission";
import UserLogin from "../pages/user/login";
import CheckoutPage from "../pages/user/checkout";

// Policy
import Policy from "../pages/policy";
import Privacy from "../pages/policy/privacy";
import Terms from "../pages/policy/terms";

// Admin pages
import AdminOrdersPage from "../pages/admin/orders";
import AdminOrderDetails from "../pages/admin/orders/[id]";
import AdminLogin from "../pages/admin/utils/login";
import AdminDashboard from "../pages/admin/dashboard";
//SuperAdmin pages
// SuperAdmin pages
import SuperAdminLayout from "../components/superadmin/AdminLayout";
import SuperAdminGuard from "../components/superadmin/AdminGuard";

import SuperAdminDashboard from "../pages/superadmin/dashboard";
import SuperAdminUsers from "../pages/superadmin/dashboard/Users";
import SuperAdminOrders from "../pages/superadmin/dashboard/Orders";
import SuperAdminLogs from "../pages/superadmin/dashboard/Logs";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },

      { path: "vision", element: <Vision /> },
      { path: "mission", element: <Mission /> },

      // login user
      { path: "user/login", element: <UserLogin /> },

      // policy
      { path: "policy", element: <Policy /> },
      { path: "policy/privacy", element: <Privacy /> },
      { path: "policy/terms", element: <Terms /> },
    ],
  },


  // Checkout user
  {
    path: "/user/checkout",
    element: <CheckoutPage />
  },

  // Admin
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
  // SuperAdmin
    // SuperAdmin
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
