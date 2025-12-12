import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import AdminLayout from "../components/layouts/AdminLayout";

// Pagine principali
import Home from "../pages/home";
import Vision from "../pages/vision";
import Mission from "../pages/mission";
import UserLogin from "../pages/user/login";
import CheckoutPage from "../pages/user/checkout";
import CartPage from "../pages/cart";

// Policy
import Policy from "../pages/policy";
import Privacy from "../pages/policy/privacy";
import Terms from "../pages/policy/terms";

// Admin pages
import AdminOrdersPage from "../pages/admin/orders";
import AdminOrderDetails from "../pages/admin/orders/[id]";
import AdminLogin from "../pages/admin/utils/login";
import AdminDashboard from "../pages/admin/dashboard";

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

  // Cart
  {
    path: "/cart",
    element: <CartPage />
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
]);

export default router;
