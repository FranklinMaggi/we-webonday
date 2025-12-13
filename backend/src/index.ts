// backend/src/index.ts
import type { Env } from "./types/env";

import {
  createCart,
  getCart,
  updateCart,
  saveUserCart,
  getUserCart,
} from "./routes/cart";

import {
  getProducts,
  getProduct,
  registerProduct,
} from "./routes/products";

import {
  acceptPolicy,
  getPolicyStatus,
} from "./routes/policy";

import {
  acceptCookies,
  getCookieStatus,
} from "./routes/cookies";

import {
  registerPolicyVersion,
  getLatestPolicy,
  getPolicyVersion,
  listPolicyVersions,
} from "./routes/policyVersion";

import { createOrder } from "./routes/order";
import { listOrders, getOrder } from "./routes/orders";

import {
  googleAuth,
  googleCallback,
  getCurrentUser,
} from "./routes/userGoogle";

import {
  createPaypalOrder,
  capturePaypalOrder,
} from "./routes/paymentPaypal";

import { requireAdmin } from "./lib/adminAuth";

/* ============================
   CORS (UNICO PUNTO)
============================ */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, x-admin-token",
};

function withCors(res: Response): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS_HEADERS)) {
    headers.set(k, v);
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

function json(body: unknown, status = 200): Response {
  return withCors(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  );
}

/* ============================
   WORKER
============================ */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const method = request.method;

    /* ===== OPTIONS ===== */
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    try {
      /* ===== AUTH ===== */
      if (pathname === "/api/user/google/auth" && method === "GET") {
        return withCors(await googleAuth(request, env));
      }

      if (pathname === "/api/user/google/callback" && method === "GET") {
        return withCors(await googleCallback(request, env));
      }

      if (pathname === "/api/user/me" && method === "GET") {
        return withCors(await getCurrentUser(request, env));
      }

      /* ===== CART ===== */
      if (pathname === "/api/cart" && method === "POST") {
        return withCors(await createCart(request, env));
      }

      if (pathname === "/api/cart" && method === "GET") {
        return withCors(await getCart(request, env));
      }

      if (pathname === "/api/cart" && method === "PUT") {
        return withCors(await updateCart(request, env));
      }

      if (pathname === "/api/cart/user" && method === "PUT") {
        return withCors(await saveUserCart(request, env));
      }

      if (pathname === "/api/cart/user" && method === "GET") {
        return withCors(await getUserCart(request, env));
      }

      /* ===== ORDERS (PUBLIC) ===== */
      if (pathname === "/api/order" && method === "POST") {
        return withCors(await createOrder(request, env));
      }

      if (pathname === "/api/order" && method === "GET") {
        return withCors(await getOrder(request, env));
      }

      if (pathname === "/api/orders/list" && method === "GET") {
        return withCors(await listOrders(request, env));
      }

      /* ===== ORDERS (ADMIN) ===== */
      if (pathname === "/api/admin/orders/list" && method === "GET") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied);
        return withCors(await listOrders(request, env));
      }

      if (pathname === "/api/admin/order" && method === "GET") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied);
        return withCors(await getOrder(request, env));
      }

      /* ===== PRODUCTS ===== */
      if (pathname === "/api/products" && method === "GET") {
        return withCors(await getProducts(env));
      }

      if (pathname === "/api/product" && method === "GET") {
        return withCors(await getProduct(request, env));
      }

      if (pathname === "/api/products/register" && method === "PUT") {
        return withCors(await registerProduct(request, env));
      }

      /* ===== POLICY ===== */
      if (pathname === "/api/policy/version/register" && method === "POST") {
        return withCors(await registerPolicyVersion(request, env));
      }

      if (pathname === "/api/policy/version/latest" && method === "GET") {
        return withCors(await getLatestPolicy(env));
      }

      if (pathname === "/api/policy/version/get" && method === "GET") {
        return withCors(await getPolicyVersion(request, env));
      }

      if (pathname === "/api/policy/version/list" && method === "GET") {
        return withCors(await listPolicyVersions(env));
      }

      if (pathname === "/api/policy/accept" && method === "POST") {
        return withCors(await acceptPolicy(request, env));
      }

      if (pathname === "/api/policy/status" && method === "GET") {
        return withCors(await getPolicyStatus(request, env));
      }

      /* ===== COOKIES ===== */
      if (pathname === "/api/cookies/accept" && method === "POST") {
        return withCors(await acceptCookies(request, env));
      }

      if (pathname === "/api/cookies/status" && method === "GET") {
        return withCors(await getCookieStatus(request, env));
      }

      /* ===== PAYPAL ===== */
      if (
        pathname === "/api/payment/paypal/create-order" &&
        method === "POST"
      ) {
        return withCors(await createPaypalOrder(request, env));
      }

      if (
        pathname === "/api/payment/paypal/capture-order" &&
        method === "POST"
      ) {
        return withCors(await capturePaypalOrder(request, env));
      }

      /* ===== 404 ===== */
      return json({ ok: false, error: "Not Found" }, 404);
    } catch (err: any) {
      console.error("Unhandled error:", err);
      return json(
        { ok: false, error: err?.message ?? "Internal error" },
        500
      );
    }
  },
};
