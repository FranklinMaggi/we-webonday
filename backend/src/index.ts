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
   CORS — unico punto centrale
============================ */
export function getCorsHeaders(request: Request, env: Env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = [
    env.FRONTEND_URL,            // es. https://www.webonday.it
    "https://webonday.it",
    "https://www.webonday.it",
    "http://localhost:5173",
    "http://localhost:5174",
  ];

  const isAllowed = allowedOrigins.includes(origin);

  const base: Record<string, string> = {
    "Access-Control-Allow-Origin": isAllowed ? origin : env.FRONTEND_URL,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-admin-token, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };

  return base;
}

/** Wrappa una Response con gli header CORS coerenti all’Origin della request. */
function withCors(res: Response, request: Request, env: Env): Response {
  const headers = new Headers(res.headers);
  const cors = getCorsHeaders(request, env);
  for (const [k, v] of Object.entries(cors)) headers.set(k, v);
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

/** Helper JSON locale (usato solo per 404/500) */
function json(body: unknown, request: Request, env: Env, status = 200): Response {
  return withCors(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
    request,
    env
  );
}

/* ============================
   WORKER
============================ */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const method = request.method;

    /* ===== OPTIONS (preflight) ===== */
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request, env),
      });
    }

    try {
      /* ===== AUTH ===== */
      if (pathname === "/api/user/google/auth" && method === "GET") {
        return withCors(await googleAuth(request, env), request, env);
      }

      if (pathname === "/api/user/google/callback" && method === "GET") {
        // Redirect 302 con Set-Cookie: CORS non è necessario ma lo manteniamo coerente
        return withCors(await googleCallback(request, env), request, env);
      }

      if (pathname === "/api/user/me" && method === "GET") {
        return withCors(await getCurrentUser(request, env), request, env);
      }

      /* ===== CART ===== */
      if (pathname === "/api/cart" && method === "POST") {
        return withCors(await createCart(request, env), request, env);
      }
      if (pathname === "/api/cart" && method === "GET") {
        return withCors(await getCart(request, env), request, env);
      }
      if (pathname === "/api/cart" && method === "PUT") {
        return withCors(await updateCart(request, env), request, env);
      }
      if (pathname === "/api/cart/user" && method === "PUT") {
        return withCors(await saveUserCart(request, env), request, env);
      }
      if (pathname === "/api/cart/user" && method === "GET") {
        return withCors(await getUserCart(request, env), request, env);
      }

      /* ===== ORDERS (PUBLIC) ===== */
      if (pathname === "/api/order" && method === "POST") {
        return withCors(await createOrder(request, env), request, env);
      }
      if (pathname === "/api/order" && method === "GET") {
        return withCors(await getOrder(request, env), request, env);
      }
      if (pathname === "/api/orders/list" && method === "GET") {
        return withCors(await listOrders(request, env), request, env);
      }

      /* ===== ORDERS (ADMIN) ===== */
      if (pathname === "/api/admin/orders/list" && method === "GET") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied, request, env);
        return withCors(await listOrders(request, env), request, env);
      }

      if (pathname === "/api/admin/order" && method === "GET") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied, request, env);
        return withCors(await getOrder(request, env), request, env);
      }

      /* ===== PRODUCTS ===== */
      if (pathname === "/api/products" && method === "GET") {
        return withCors(await getProducts(env), request, env);
      }

      if (pathname === "/api/product" && method === "GET") {
        return withCors(await getProduct(request, env), request, env);
      }

      if (pathname === "/api/products/register" && method === "PUT") {
        return withCors(await registerProduct(request, env), request, env);
      }

      /* ===== POLICY ===== */
      if (pathname === "/api/policy/version/register" && method === "POST") {
        return withCors(await registerPolicyVersion(request, env), request, env);
      }
      if (pathname === "/api/policy/version/latest" && method === "GET") {
        return withCors(await getLatestPolicy(env), request, env);
      }
      if (pathname === "/api/policy/version/get" && method === "GET") {
        return withCors(await getPolicyVersion(request, env), request, env);
      }
      if (pathname === "/api/policy/version/list" && method === "GET") {
        return withCors(await listPolicyVersions(env), request, env);
      }
      if (pathname === "/api/policy/accept" && method === "POST") {
        return withCors(await acceptPolicy(request, env), request, env);
      }
      if (pathname === "/api/policy/status" && method === "GET") {
        return withCors(await getPolicyStatus(request, env), request, env);
      }

      /* ===== PAYPAL ===== */
      if (pathname === "/api/payment/paypal/create-order" && method === "POST") {
        return withCors(await createPaypalOrder(request, env), request, env);
      }
      if (pathname === "/api/payment/paypal/capture-order" && method === "POST") {
        return withCors(await capturePaypalOrder(request, env), request, env);
      }

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
