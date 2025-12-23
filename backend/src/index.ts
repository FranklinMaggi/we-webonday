// backend/src/index.ts

import type { Env } from "./types/env";

/* ============================
   ROUTES IMPORT
============================ */

// AUTH
import {
  googleAuth,
  googleCallback,
} from "./routes/auth/google";

import {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
} from "./routes/auth/password";

import {
  getCurrentUser
} from "./routes/auth/session";
// CART
import { saveCart, getCart } from "./routes/cart";

// BUSINESS
import { createBusiness, getBusiness } from "./routes/business/business";
import { getMyBusiness } from "./routes/business/businessMine";
import { getBusinessPublic } from "./routes/business/businessPublic";
import { submitBusiness } from "./routes/business/businessSubmit";
import { uploadBusinessMenu } from "./routes/business/uploadMenu";

// PRODUCTS
import {
  getProducts,
  getProduct,
  registerProduct,
} from "./routes/products";

// ORDERS
import {
  createOrder,
  listOrders,
  getOrder,
} from "./routes/orders";

// PAYPAL
import {
  createPaypalOrder,
  capturePaypalOrder,
} from "./routes/paymentPaypal";

// POLICY
import {
  registerPolicyVersion,
  getLatestPolicy,
  getPolicyVersion,
  listPolicyVersions,
  acceptPolicy,
  getPolicyStatus,
} from "./routes/policy";

// COOKIES
import {
  acceptCookies,
  getCookieStatus,
} from "./routes/cookies";

// ADMIN
import { requireAdmin } from "./lib/adminAuth";

// HTTP
import { json } from "./lib/https";

/* ============================
   CORS — SINGLE SOURCE
============================ */
export function getCorsHeaders(request: Request, env: Env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = [
    env.FRONTEND_URL,
    "https://webonday.it",
    "https://www.webonday.it",
    "http://localhost:5173",
    "http://localhost:5174",
  ];

  const isAllowed = allowedOrigins.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : env.FRONTEND_URL,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-admin-token, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}

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

/* ============================
   WORKER
============================ */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const method = request.method;

    /* ===== PREFLIGHT ===== */
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request, env),
      });
    }

    try {
      /* ===== AUTH ===== */
      if (pathname === "/api/user/google/auth" && method === "GET")
        return withCors(await googleAuth(request, env), request, env);

      if (pathname === "/api/user/google/callback" && method === "GET")
        return withCors(await googleCallback(request, env), request, env);

      if (pathname === "/api/user/me" && method === "GET")
        return withCors(await getCurrentUser(request, env), request, env);

      if (pathname === "/api/user/register" && method === "POST")
        return withCors(await registerUser(request, env), request, env);

      if (pathname === "/api/user/login" && method === "POST")
        return withCors(await loginUser(request, env), request, env);

      if (pathname === "/api/user/get" && method === "GET")
        return withCors(await getUser(request, env), request, env);

      if (pathname === "/api/user/logout" && method === "POST")
        return withCors(await logoutUser(request, env), request, env);

      /* ===== CART ===== */
if (pathname === "/api/cart" && method === "POST") {
  const cart = await saveCart(request, env);
  return withCors(
    json({ ok: true, cart }, request, env),
    request,
    env
  );
}

if (pathname === "/api/cart" && method === "GET") {
  const cart = await getCart(request, env);
  return withCors(
    json({ ok: true, cart }, request, env),
    request,
    env
  );
}

      /* ===== ORDERS ===== */
      if (pathname === "/api/order" && method === "POST")
        return withCors(await createOrder(request, env), request, env);

      if (pathname === "/api/order" && method === "GET")
        return withCors(await getOrder(request, env), request, env);

      if (pathname === "/api/orders/list" && method === "GET")
        return withCors(await listOrders(request, env), request, env);

      /* ===== ADMIN ORDERS ===== */
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
  const products = await getProducts(env);
  return withCors(
    json({ ok: true, products }, request, env),
    request,
    env
  );
}

if (pathname === "/api/product" && method === "GET") {
  const product = await getProduct(request, env);
  return withCors(
    json({ ok: true, product }, request, env),
    request,
    env
  );
}

if (pathname === "/api/products/register" && method === "PUT") {
  const product = await registerProduct(request, env);
  return withCors(
    json({ ok: true, product }, request, env),
    request,
    env
  );
}

      /* ===== POLICY ===== */
      if (pathname === "/api/policy/version/register" && method === "POST")
        return withCors(await registerPolicyVersion(request, env), request, env);

      if (pathname === "/api/policy/version/latest" && method === "GET")
        return withCors(await getLatestPolicy(env), request, env);

      if (pathname === "/api/policy/version/get" && method === "GET")
        return withCors(await getPolicyVersion(request, env), request, env);

      if (pathname === "/api/policy/version/list" && method === "GET")
        return withCors(await listPolicyVersions(env), request, env);

      if (pathname === "/api/policy/accept" && method === "POST")
        return withCors(await acceptPolicy(request, env), request, env);

      if (pathname === "/api/policy/status" && method === "GET")
        return withCors(await getPolicyStatus(request, env), request, env);

      /* ===== PAYPAL ===== */
      if (
        pathname === "/api/payment/paypal/create-order" &&
        method === "POST"
      ) {
        return withCors(
          await createPaypalOrder(request, env),
          request,
          env
        );
      }
      
      if (
        pathname === "/api/payment/paypal/capture-order" &&
        method === "POST"
      ) {
        return withCors(
          await capturePaypalOrder(request, env),
          request,
          env
        );
      }
      

      /* ===== COOKIES ===== */
      if (pathname === "/api/cookies/accept" && method === "POST")
        return withCors(await acceptCookies(request, env), request, env);

      if (pathname === "/api/cookies/status" && method === "GET")
        return withCors(await getCookieStatus(), request, env);

      /* ===== BUSINESS ===== */
      if (pathname === "/api/business/mine" && method === "GET")
        return withCors(await getMyBusiness(request, env), request, env);

      if (pathname === "/api/business/create" && method === "POST")
        return withCors(await createBusiness(request, env), request, env);

      if (pathname === "/api/business/submit" && method === "POST")
        return withCors(await submitBusiness(request, env), request, env);

      if (pathname === "/api/business/menu/upload" && method === "POST")
        return withCors(await uploadBusinessMenu(request, env), request, env);

      if (pathname.startsWith("/api/business/public/") && method === "GET")
        return withCors(await getBusinessPublic(request, env), request, env);

      if (pathname.startsWith("/api/business/") && method === "GET")
        return withCors(await getBusiness(request, env), request, env);

      /* ===== 404 ===== */
      return json(
        { ok: false, error: "NOT_FOUND" },
        request,
        env,
        404
      );
    } catch (err: any) {
      console.error("Unhandled error:", err);
      return json(
        { ok: false, error: "INTERNAL_ERROR" },
        request,
        env,
        500
      );
    }
  },
};
