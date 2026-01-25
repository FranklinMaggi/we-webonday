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
import { MainLayout } from "../../user/pages/setup/MainLayout";
import UserDashboardShell from "../../user/pages/dashboard/UserDashboardShell";
//import ConfiguratorLayout from "../pages/user/dashboard/configurator/setup/steps/layouts/ConfiguratorLayout";
import AdminLayout from "../../admin/components/admin/layouts/AdminLayout";
import Mission from "../../marketing/pages/mission";
/* =========================
   GUARDS
========================= */
import { ProtectedRoute } from "./ProtectedRoute";
import AdminGuard from "../../admin/components/admin/AdminGuard";

/* =========================
   PUBLIC PAGES (SHARED)
========================= */
import Home from "../../marketing/pages/home";
import Vision from "../../marketing/pages/vision";

import FounderPage from "../../marketing/pages/founder";
import Price from "../../marketing/pages/pricing";

import Solutions from "../../marketing/pages/solution/soltuionpage";
import HomeSolutionPage from "../../marketing/pages/solution/soltuionpage/[id]";

import UserLogin from "../../user/auth";

/* =========================
   POLICY
========================= */
import Privacy from "../../shared/terms/policy/privacy";
import Terms from "../../shared/terms/policy/terms";
import PolicyPage from "../../shared/terms/policy/policy";

/* =========================
   USER — DASHBOARD & FLOWS
========================= */
import UserDashboardHome from "../../user/pages/dashboard";
import UserBusinessDashboard from "../../user/pages";
import YouDashboardPage from "@src/user/pages/you/hard-driver";

import UserBusinessDetail from "../../user/pages/you/business/[id]";
import WorkspaceIndex from "../../user/pages/workspace";
/* =========================
   USER — CONFIGURATOR
========================= */
//import UserConfiguratorIndex from "../pages/user/dashboard/configurator/index";
import ConfigurationIndex from "../../user/configurator/[id]";
import PostLoginHandoff from "../../user/pages/PostLoginHandoff";
/* =========================
   ADMIN
========================= */
import AdminLogin from "../../admin/pages/login/login";
import AdminDashboard from "../../admin/pages/dashboard";
import AdminOrdersPage from "../../admin/pages/orders";
import AdminOrderDetails from "../../admin/pages/orders/[id]";
import AdminUsersPage from "../../admin/pages/users";
import AdminProductsPage from "../../admin/pages/products";
import AdminEditProductPage from "../../admin/pages/products/[id]";
import AdminOptionsPage from "../../admin/pages/products/options";
import AdminEditOptionPage from "../../admin/pages/products/options/[id]";
import SolutionsList from "../../admin/pages/solutions";
import SolutionEditor from "../../admin/pages/solutions/[id]";
import UserConfigurationWorkspace from "../../user/pages/workspace/[id]";
import { useParams } from "react-router-dom";
import ProfilePage from "../../user/pages/you/profile";
import AccountPage from "../../user/pages/you/account";
function RedirectConfiguratorToDashboard() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return (
    <Navigate to={`/user/dashboard/configuration/${id}`} replace />
  );
}

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
          { path: "post-login", element: <PostLoginHandoff /> },

          /* ================= DASHBOARD ================= */
          {
            path: "dashboard",
            element: <UserDashboardShell />,
            children: [
             

              /* ===== HOME ===== */
              { index: true, element: <UserDashboardHome /> },
              {
                path: "you",
                element: <Outlet />,
                children: [
                  { index: true, element: <YouDashboardPage /> },
                  { path: "profile", element: <ProfilePage /> },
                  { path: "account", element: <AccountPage /> },
                  {
                    path: "settings",
                    element: <p>Impostazioni YOU (future)</p>,
                  },
                ],
              },
              
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
            element: <RedirectConfiguratorToDashboard />,
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
