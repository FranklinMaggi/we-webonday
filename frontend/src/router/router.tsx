// ======================================================
// FE || router/router.tsx
// ======================================================
//
// APPLICATION ROUTER — STRUCTURED & READABLE
//
// PRINCIPI (INVARIANTI):
// - PUBLIC ≠ VISITOR (le pagine pubbliche sono accessibili anche da user)
// - /user è SEMPRE protetto
// - Dashboard canonica: /user/dashboard
// - Redirect SEMPRE esplicito
// - MainLayout condiviso tra public, user e business
// ======================================================

import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";

/* =========================
   GUARDS
========================= */
import { ProtectedRoute } from "./ProtectedRoute";
import BusinessGuard from "../components/business/BusinessGuard";
import AdminGuard from "../components/admin/AdminGuard";

/* =========================
   PUBLIC PAGES (SHARED)
========================= */
import Home from "../pages/home";
import Vision from "../pages/vision";
import Mission from "../pages/mission";
import FounderPage from "../pages/founder";
import Price from "../pages/pricing";

import Solutions from "../pages/home/solution";        // /solution
import HomeSolutionPage from "../pages/home/solution/[id]";

import UserLogin from "../pages/user/login";

/* =========================
   POLICY
========================= */
import Privacy from "../pages/policy/privacy";
import Terms from "../pages/policy/terms";
import PolicyPage from "../pages/policy/policy";

/* =========================
   USER (BUYER) — 🔒
========================= */
import DashboardLayout from "../pages/user/dashboard/layout/DashBoardLayout";
import UserDashboardHome from "../pages/user/dashboard";
import UserDashboardDetail from "../pages/user/dashboard/[id]";
import UserConfigurationWorkspace from "../pages/user/dashboard/configuration/[id]";
import CheckoutPage from "../pages/user/checkout";
import UserConfiguratorDetail from "../pages/user/configurator/[id]";

/* =========================
   ADMIN — 🔒
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
   BUSINESS (SaaS PURO) — 🔒
========================= */
import BusinessDashboard from "../pages/business/Dashboard";

/* =====================================================
   ROUTER
===================================================== */
const router = createBrowserRouter([
  /* =====================================================
     PUBLIC (ACCESSIBILE A TUTTI)
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

      /* === SOLUTIONS (PUBLIC SHARED) === */
      { path: "solution", element: <Solutions /> },
      { path: "solution/:id", element: <HomeSolutionPage /> },

      /* === AUTH === */
      { path: "user/login", element: <UserLogin /> },

      /* === POLICY === */
      { path: "policy/privacy", element: <Privacy /> },
      { path: "policy/terms", element: <Terms /> },
      { path: "policy", element: <PolicyPage /> },
    ],
  },

  /* =====================================================
     USER (BUYER) — 🔒
  ===================================================== */
  {
    path: "/user",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },

          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <UserDashboardHome /> },
              { path: ":id", element: <UserDashboardDetail /> },
              {
                path: "configuration/:id",
                element: <UserConfigurationWorkspace />,
              },
            ],
          },

          {
            path: "configurator",
            children: [
              { path: ":id", element: <UserConfiguratorDetail /> },
            ],
          },

          { path: "checkout", element: <CheckoutPage /> },
        ],
      },
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
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <BusinessDashboard /> },
    ],
  },
]);

export default router;
