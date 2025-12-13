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
   CORS — UNICO PUNTO
============================ */
export function getCorsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin");

  const allowedOrigins = [
    env.FRONTEND_URL,
    "http://localhost:5173",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, x-admin-token",
    };
  }

  return {
    "Access-Control-Allow-Origin": env.FRONTEND_URL,
    "Access-Control-Allow-Credentials": "true",
  };
}

function json(
  body: unknown,
  request: Request,
  env: Env,
  status = 200
): Response {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const cors = getCorsHeaders(request, env);
  for (const [k, v] of Object.entries(cors)) {
    headers.set(k, v);
  }

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
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
        headers: new Headers(getCorsHeaders(request, env)),
      });
    }

    try {
      /* ===== AUTH ===== */
      if (pathname === "/api/user/google/auth" && method === "GET") {
        const res = await googleAuth(request, env);
        const headers = new Headers(res.headers);

        const cors = getCorsHeaders(request, env);
        for (const [k, v] of Object.entries(cors)) {
          headers.set(k, v);
        }

        return new Response(res.body, {
          status: res.status,
          headers,
        });
      }

      if (pathname === "/api/user/google/callback" && method === "GET") {
        const res = await googleCallback(request, env);
        const headers = new Headers(res.headers);

        const cors = getCorsHeaders(request, env);
        for (const [k, v] of Object.entries(cors)) {
          headers.set(k, v);
        }

        return new Response(res.body, {
          status: res.status,
          headers,
        });
      }

      if (pathname === "/api/user/me" && method === "GET") {
        const res = await getCurrentUser(request, env);
        const headers = new Headers(res.headers);

        const cors = getCorsHeaders(request, env);
        for (const [k, v] of Object.entries(cors)) {
          headers.set(k, v);
        }

        return new Response(res.body, {
          status: res.status,
          headers,
        });
      }

      /* ===== CART ===== */
      if (pathname === "/api/cart" && method === "POST") return await createCart(request, env);
      if (pathname === "/api/cart" && method === "GET") return await getCart(request, env);
      if (pathname === "/api/cart" && method === "PUT") return await updateCart(request, env);
      if (pathname === "/api/cart/user" && method === "PUT") return await saveUserCart(request, env);
      if (pathname === "/api/cart/user" && method === "GET") return await getUserCart(request, env);

      /* ===== ORDERS ===== */
      if (pathname === "/api/order" && method === "POST") return await createOrder(request, env);
      if (pathname === "/api/order" && method === "GET") return await getOrder(request, env);
      if (pathname === "/api/orders/list" && method === "GET") return await listOrders(request, env);

      /* ===== ADMIN ===== */
      if (pathname === "/api/admin/orders/list" && method === "GET") {
        const denied = requireAdmin(request, env);
        if (denied) return denied;
        return await listOrders(request, env);
      }

      if (pathname === "/api/admin/order" && method === "GET") {
        const denied = requireAdmin(request, env);
        if (denied) return denied;
        return await getOrder(request, env);
      }

      /* ===== PRODUCTS ===== */
      if (pathname === "/api/products" && method === "GET") return await getProducts(env);
      if (pathname === "/api/product" && method === "GET") return await getProduct(request, env);
      if (pathname === "/api/products/register" && method === "PUT") return await registerProduct(request, env);

      /* ===== POLICY ===== */
      if (pathname === "/api/policy/version/register" && method === "POST") return await registerPolicyVersion(request, env);
      if (pathname === "/api/policy/version/latest" && method === "GET") return await getLatestPolicy(env);
      if (pathname === "/api/policy/version/get" && method === "GET") return await getPolicyVersion(request, env);
      if (pathname === "/api/policy/version/list" && method === "GET") return await listPolicyVersions(env);
      if (pathname === "/api/policy/accept" && method === "POST") return await acceptPolicy(request, env);
      if (pathname === "/api/policy/status" && method === "GET") return await getPolicyStatus(request, env);

      /* ===== COOKIES ===== */
      if (pathname === "/api/cookies/accept" && method === "POST") return await acceptCookies(request, env);
      if (pathname === "/api/cookies/status" && method === "GET") return await getCookieStatus(request, env);

      /* ===== PAYPAL ===== */
      if (pathname === "/api/payment/paypal/create-order" && method === "POST")
        return await createPaypalOrder(request, env);

      if (pathname === "/api/payment/paypal/capture-order" && method === "POST")
        return await capturePaypalOrder(request, env);

      /* ===== 404 ===== */
      return json({ ok: false, error: "Not Found" }, request, env, 404);
    } catch (err: any) {
      console.error("Unhandled error:", err);
      return json(
        { ok: false, error: err?.message ?? "Internal error" },
        request,
        env,
        500
      );
    }
  },
};
