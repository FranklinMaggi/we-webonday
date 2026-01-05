// ======================================================
// FE || router/router.tsx
// ======================================================
//
// AI-SUPERCOMMENT — APPLICATION ROUTER
//
// RUOLO:
// - Mappa di navigazione globale
// - Separazione netta Visitor / User / Business / Admin
//
// INVARIANTI:
// - /user è SEMPRE protetto
// - Redirect post-login → /user/dashboard
// ======================================================

import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";

/* =========================
   GUARDS
========================= */
import { ProtectedRoute } from "./ProtectedRoute";
import AdminGuard from "../components/admin/AdminGuard";
import BusinessGuard from "../components/business/BusinessGuard";

/* =========================
   PUBLIC PAGES
========================= */
import Home from "../pages/home";
import Vision from "../pages/vision";
import Mission from "../pages/mission";
import FounderPage from "../pages/founder";
import Price from "../pages/pricing";
import HomeSolutionPage from "../pages/home/solution/[id]";

/* =========================
   USER PAGES
========================= */
import UserLogin from "../pages/user/login";
import UserDashboardPage from "../pages/user";
import CheckoutPage from "../pages/user/checkout";

/* =========================
   USER BUSINESS
========================= */
import UserBusinessDashboard from "../pages/user/business/UserBusinessDashboard";
import RegisterBusiness from "../pages/user/business/RegisterBusiness";

/* =========================
   POLICY
========================= */
import Privacy from "../pages/policy/privacy";
import Terms from "../pages/policy/terms";
import PolicyPage from "../pages/policy/policy";

/* =========================
   ADMIN
========================= */
import AdminLogin from "../pages/admin/login/login";
import AdminLayout from "../components/admin/layouts/AdminLayout";
import AdminDashboard from "../pages/admin/dashboard";
import AdminOrdersPage from "../pages/admin/orders";
import AdminOrderDetails from "../pages/admin/orders/[id]";
import AdminUsersPage from "../pages/admin/users";
import AdminProductsPage from "../pages/admin/products";
import AdminEditProductPage from "../pages/admin/products/[id]";
import AdminOptionsPage from "../pages/admin/products/options";
import AdminEditOptionPage from "../pages/admin/products/options/[id]";
import SolutionsList from "../pages/admin/solutions";
import SolutionEditor from "../pages/admin/solutions/[id]";

/* =========================
   BUSINESS (SaaS)
========================= */
import BusinessDashboard from "../pages/business/Dashboard";

const router = createBrowserRouter([
  /* =====================================================
     PUBLIC AREA (VISITOR)
  ===================================================== */
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "vision", element: <Vision /> },
      { path: "mission", element: <Mission /> },
      { path: "founder", element: <FounderPage /> },
      { path: "pricing", element: <Price /> },
      { path: "home/solution/:id", element: <HomeSolutionPage /> },

      /* AUTH */
      { path: "user/login", element: <UserLogin /> },

      /* POLICY */
      { path: "policy/privacy", element: <Privacy /> },
      { path: "policy/terms", element: <Terms /> },
      { path: "policy", element: <PolicyPage /> },
    ],
  },

  /* =====================================================
     USER AREA (BUYER) — 🔒
  ===================================================== */
  {
    path: "user",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <UserDashboardPage />,
      },

      { path: "checkout", element: <CheckoutPage /> },

      { path: "business/dashboard", element: <UserBusinessDashboard /> },
      { path: "business/register", element: <RegisterBusiness /> },
    ],
  },

  /* =====================================================
     ADMIN — 🔒
  ===================================================== */
  {
    path: "/admin",
    children: [
      { path: "login", element: <AdminLogin /> },
      {
        element: <AdminGuard />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "dashboard", element: <AdminDashboard /> },
              { path: "orders", element: <AdminOrdersPage /> },
              { path: "orders/:id", element: <AdminOrderDetails /> },
              { path: "users", element: <AdminUsersPage /> },

              { path: "solutions", element: <SolutionsList /> },
              { path: "solutions/:id", element: <SolutionEditor /> },

              { path: "products", element: <AdminProductsPage /> },
              { path: "products/:id", element: <AdminEditProductPage /> },

              { path: "options", element: <AdminOptionsPage /> },
              { path: "options/:id", element: <AdminEditOptionPage /> },
            ],
          },
        ],
      },
    ],
  },

  /* =====================================================
     BUSINESS (SaaS PURO) — 🔒
  ===================================================== */
  {
    path: "/business",
    element: (
      <BusinessGuard>
        <MainLayout />
      </BusinessGuard>
    ),
    children: [{ path: "dashboard", element: <BusinessDashboard /> }],
  },
]);

export default router;
