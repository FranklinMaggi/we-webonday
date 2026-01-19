// ======================================================
// FE || router/router.tsx
// ======================================================
//
// AI-SUPERCOMMENT — APPLICATION ROUTER (CANONICAL)
//
// RUOLO:
// - Definisce TUTTE le rotte dell’applicazione
// - Stabilisce i confini tra:
//   • pubblico
//   • user (buyer)
//   • admin
//
// PRINCIPI INVARIANTI (NON NEGOZIABILI):
// 1. PUBLIC ≠ VISITOR
//    (le pagine pubbliche sono accessibili anche a user autenticati)
// 2. /user è SEMPRE protetto (ProtectedRoute)
// 3. Dashboard canonica: /user/dashboard
// 4. Redirect SEMPRE esplicito (mai implicito)
// 5. MainLayout è condiviso tra:
//    • public
//    • user
//    • configurator
// 6. Configurator ≠ Dashboard
//    (sono due domini UI separati)
//
// NOTE IMPORTANTI:
// - Questo file NON contiene logica business
// - Questo file NON valida dati
// - Questo file è SOLO routing + composizione layout
//
// ======================================================

import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

/* =========================
   LAYOUTS
========================= */
import { MainLayout } from "../pages/user/dashboard/configurator/setup/steps/layouts/MainLayout";
import DashboardLayout from "../pages/user/dashboard/DashboardLayout";
//import ConfiguratorLayout from "../pages/user/dashboard/configurator/setup/steps/layouts/ConfiguratorLayout";
import AdminLayout from "../components/admin/layouts/AdminLayout";

/* =========================
   GUARDS
========================= */
import { ProtectedRoute } from "./ProtectedRoute";
import AdminGuard from "../components/admin/AdminGuard";

/* =========================
   PUBLIC PAGES (SHARED)
========================= */
import Home from "../pages/home";
import Vision from "../pages/vision";
import Mission from "../pages/mission";
import FounderPage from "../pages/founder";
import Price from "../pages/pricing";

import Solutions from "../pages/home/solution";
import HomeSolutionPage from "../pages/home/solution/[id]";

import UserLogin from "../pages/user/auth";

/* =========================
   POLICY
========================= */
import Privacy from "../pages/policy/privacy";
import Terms from "../pages/policy/terms";
import PolicyPage from "../pages/policy/policy";

/* =========================
   USER — DASHBOARD & FLOWS
========================= */
import UserDashboardHome from "../pages/user/dashboard";
import UserBusinessDashboard from "../pages/user/dashboard/business";
import UserBusinessDetail from "../pages/user/dashboard/business/[id]";
import WorkspaceIndex from "../pages/user/dashboard/workspace";
/* =========================
   USER — CONFIGURATOR
========================= */
//import UserConfiguratorIndex from "../pages/user/dashboard/configurator/index";
import ConfigurationIndex from "../pages/user/dashboard/configurator/index";

/* =========================
   ADMIN
========================= */
import AdminLogin from "../pages/admin/login/login";
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
import UserConfigurationWorkspace from "../pages/user/dashboard/workspace/[id]";
/* =====================================================
   ROUTER DEFINITION
===================================================== */
const router = createBrowserRouter([
  /* =====================================================
     PUBLIC — ACCESSIBILE A TUTTI
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

      /* ===== SOLUTIONS (PUBLIC / SHARED) ===== */
      { path: "solution", element: <Solutions /> },
      { path: "solution/:id", element: <HomeSolutionPage /> },

      /* ===== AUTH ===== */
      { path: "user/login", element: <UserLogin /> },

      /* ===== POLICY ===== */
      { path: "policy/privacy", element: <Privacy /> },
      { path: "policy/terms", element: <Terms /> },
      { path: "policy", element: <PolicyPage /> },
    ],
  },

  /* =====================================================
     USER (BUYER) — 🔒 PROTECTED
  ===================================================== */
  {
    path: "/user",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },

          /* ================= DASHBOARD ================= */
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              /* ===== HOME ===== */
              { index: true, element: <UserDashboardHome /> },

              /* ===== BUSINESS ===== */
              {
                path: "business",
                element: <Outlet />,
                children: [
                  { index: true, element: <UserBusinessDashboard /> },
                  { path: ":id", element: <UserBusinessDetail /> },
                ],
              },
                /* ===== CONFIGURATOR (EMBEDDED IN DASHBOARD) ===== */
{
  path: "configuration/:id",
  element: <ConfigurationIndex />, // riusa l’entry del configurator
},
              /* ===== CONFIGURATION WORKSPACE (POST-WIZARD) ===== */
              {
                path: "workspace",
                children: [
                  {
                    index: true,
                    element: <WorkspaceIndex />,
                  },
                  {
                    path: ":id",
                    element: <UserConfigurationWorkspace />,
                  },
                ],
              },
              

              /* ===== ORDERS (PLACEHOLDER CANONICO) ===== */
              {
                path: "orders",
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: (
                      <p>Sezione ordini — implementazione futura</p>
                    ),
                  },
                ],
              },

              /* ===== SETTINGS (PLACEHOLDER STRUTTURATO) ===== */
              {
                path: "settings",
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <p>Impostazioni account</p>,
                  },
                  { path: "profile", element: <Outlet /> },
                  { path: "plan", element: <Outlet /> },
                  { path: "privacy", element: <Outlet /> },
                  { path: "password", element: <Outlet /> },
                  { path: "cookies", element: <Outlet /> },
                ],
              },
            ],
          },

          /* ================= CONFIGURATOR ================= */
          {
            path: "configurator/:id",
            element:<Navigate to="/user/dashboard/configuration/:id" replace />
          },
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
]);

export default router;
