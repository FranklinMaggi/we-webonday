// src/router/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import AdminLayout from "../components/admin/layouts/AdminLayout";
import AdminGuard from "../components/admin/AdminGuard";
/* =========================
   PAGES
========================= */

// Public
import Home from "../pages/home";
import Vision from "../pages/vision";
import Mission from "../pages/mission";
import FounderPage from "../pages/founder";

// User
import UserLogin from "../pages/user/login";
import CheckoutPage from "../pages/user/checkout";

// Policy
import Privacy from "../pages/policy/privacy";
import Terms from "../pages/policy/terms";
import PolicyPage from "../pages/policy/policy";
// User Business
import UserBusinessDashboard from "../pages/user/business/UserBusinessDashboard";
import RegisterBusiness from "../pages/user/business/RegisterBusiness";

// Business
import BusinessDashboard from "../pages/business/Dashboard";
import BusinessGuard from "../components/business/BusinessGuard";

// Admin
import AdminLogin from "../pages/admin/login/login";
import AdminDashboard from "../pages/admin/dashboard";
import AdminOrdersPage from "../pages/admin/orders";
import AdminUsersPage from "../pages/admin/users";

import AdminOrderDetails from "../pages/admin/orders/[id]";

const router = createBrowserRouter([
  /* =========================
     PUBLIC + USER (MAIN LAYOUT)
  ========================= */
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "vision", element: <Vision /> },
      { path: "mission", element: <Mission /> },
      { path: "founder", element: <FounderPage /> },

      { path: "user/login", element: <UserLogin /> },
      { path: "user/checkout", element: <CheckoutPage /> },
      { path: "user/business/dashboard", element: <UserBusinessDashboard /> },
      { path: "user/business/register", element: <RegisterBusiness /> },

      { path: "policy/privacy", element: <Privacy /> },
      { path: "policy/terms", element: <Terms /> },
      { path: "policy", element: <PolicyPage /> },
    ],
  },

  /* =========================
     ADMIN
  ========================= */
 /* =========================
   ADMIN
========================= */
{
  path: "/admin",
  children: [
    // 🔓 login pubblico
    { path: "login", element: <AdminLogin /> },

    // 🔒 tutto il resto protetto
    {
      element: <AdminGuard />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { path: "dashboard", element: <AdminDashboard /> },
            { path: "orders", element: <AdminOrdersPage /> },
            { path: "orders/:id", element: <AdminOrderDetails /> },
            { path: "users", element: <AdminUsersPage /> }

          ],
        },
      ],
    },
  ],
},

  /* =========================
     SUPERADMIN
  ========================= */
 
  /* =========================
   BUSINESS (SaaS)
========================= */
{
  path: "/business",
  element: (
    <BusinessGuard>
      <MainLayout />
    </BusinessGuard>
  ),
  children: [
    { path: "dashboard", element: <BusinessDashboard /> },
  ],
},

]);

export default router;
