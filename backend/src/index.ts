// ============================================================
// File: backend/src/index.ts
// ============================================================
//
// RESPONSABILITÀ DI QUESTO FILE
// ------------------------------------------------------------
// - Entry point del Cloudflare Worker
// - Mapping URL → handler di dominio
// - Applicazione CORS (single source of truth)
// - Applicazione guard di sicurezza (admin / session)
// - Gestione errori globali
//
// NON DEVE:
// - contenere logica di business
// - contenere validazioni di dominio
// - mutare dati direttamente
// ============================================================

import type { Env } from "./types/env";

/* ============================================================
   AUTH — USER
============================================================ */

import { googleAuth } from "./routes/auth/google";
import { googleCallback } from "./routes/auth/google";

import { registerUser } from "./routes/auth/password";
import { loginUser } from "./routes/auth/password";
import { getUser } from "./routes/auth/password";
import { logoutUser } from "./routes/auth/password";

/* ============================================================
   CART — VISITOR / USER
============================================================ */

import { saveCart } from "./routes/cart/cart";
import { getCart } from "./routes/cart/cart";

/* ============================================================
   ORDERS — USER
============================================================ */

import { createOrder } from "./routes/orders";
import { listOrders } from "./routes/orders";
import { getOrder } from "./routes/orders";

import { saveOrderSetup } from "./routes/orders/orderSetup";

/* ============================================================
   PAYMENT — PAYPAL
============================================================ */

import { createPaypalOrder } from "./routes/payment/paypal";
import { capturePaypalOrder } from "./routes/payment/paypal";

/* ============================================================
   POLICY — LEGALE (BLOCCANTE)
============================================================ */

import { registerPolicyVersion } from "./routes/policy";
import { getLatestPolicy } from "./routes/policy";
import { listPolicyVersions } from "./routes/policy";
import { acceptPolicy } from "./routes/policy";
import { getPolicyStatus } from "./routes/policy";

/* ============================================================
   BUSINESS — USER
============================================================ */

import { createBusiness } from "./routes/business/business";
import { getBusiness } from "./routes/business/business";
import { getMyBusiness } from "./routes/business/businessMine";
import { getBusinessPublic } from "./routes/business/businessPublic";
import { submitBusiness } from "./routes/business/businessSubmit";
import { uploadBusinessMenu } from "./routes/business/uploadMenu";

/* ============================================================
   PRODUCTS
============================================================ */

import { getProducts } from "./routes/products/products";
import { getProduct } from "./routes/products/products";
import { registerProduct } from "./routes/products/products";

/* ============================================================
   COOKIES — CONSENSO
============================================================ */

import { acceptCookies } from "./routes/cookies/cookies";
import { getCookieStatus } from "./routes/cookies/cookies";

/* ============================================================
   ADMIN — GUARD
============================================================ */

import { requireAdmin } from "./routes/admin/admin.guard";

/* ============================================================
   ADMIN — READ
============================================================ */

import { listAdminOrders } from "./routes/admin/orders.admin";
import { getAdminOrder as getAdminOrderAdmin } from "./routes/admin/orders.admin";

import { listAdminUsers } from "./routes/admin/user.read";

/* ============================================================
   ADMIN — WRITE (STATE MACHINE)
============================================================ */

import { transitionOrder } from "./routes/admin/orders.actions";
import { deleteOrder } from "./routes/admin/orders.actions";
import { cloneOrder } from "./routes/admin/orders.actions";

/* ============================================================
   ADMIN — KPI
============================================================ */

import { getAdminKPI } from "./routes/admin/kpi.read";

/* ============================================================
   HTTP HELPERS
============================================================ */

import { json } from "./lib/https";

/* ============================================================
   CORS — SINGLE SOURCE OF TRUTH
============================================================ */

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

  for (const [k, v] of Object.entries(cors)) {
    headers.set(k, v);
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

/* ============================================================
   WORKER ENTRYPOINT
============================================================ */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const method = request.method;

    /* ================= PREFLIGHT ================= */
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request, env),
      });
    }

    try {

      /* ======================================================
         AUTH
      ====================================================== */
      if (pathname === "/api/user/google/auth" && method === "GET")
        return withCors(await googleAuth(request, env), request, env);

      if (pathname === "/api/user/google/callback" && method === "GET")
        return withCors(await googleCallback(request, env), request, env);

      if (pathname === "/api/user/me" && method === "GET")
        return withCors(await getUser(request, env), request, env);

      if (pathname === "/api/user/register" && method === "POST")
        return withCors(await registerUser(request, env), request, env);

      if (pathname === "/api/user/login" && method === "POST")
        return withCors(await loginUser(request, env), request, env);

      if (pathname === "/api/user/logout" && method === "POST")
        return withCors(await logoutUser(request, env), request, env);

      /* ======================================================
         CART
      ====================================================== */
      if (pathname === "/api/cart" && method === "POST")
        return withCors(json({ ok: true, cart: await saveCart(request, env) }, request, env), request, env);

      if (pathname === "/api/cart" && method === "GET")
        return withCors(json({ ok: true, cart: await getCart(request, env) }, request, env), request, env);

      /* ======================================================
         ORDERS — USER
      ====================================================== */
      if (pathname === "/api/order" && method === "POST")
        return withCors(await createOrder(request, env), request, env);

      if (pathname === "/api/order" && method === "GET")
        return withCors(await getOrder(request, env), request, env);

      if (pathname === "/api/orders/list" && method === "GET")
        return withCors(await listOrders(request, env), request, env);

      if (pathname === "/api/order/setup" && method === "POST")
        return withCors(await saveOrderSetup(request, env), request, env);

      /* ======================================================
         PAYMENT — PAYPAL
      ====================================================== */
      if (pathname === "/api/payment/paypal/create-order" && method === "POST")
        return withCors(await createPaypalOrder(request, env), request, env);

      if (pathname === "/api/payment/paypal/capture-order" && method === "POST")
        return withCors(await capturePaypalOrder(request, env), request, env);

      /* ======================================================
         POLICY
      ====================================================== */
      if (pathname === "/api/policy/version/register" && method === "POST")
        return withCors(await registerPolicyVersion(request, env), request, env);

      if (pathname === "/api/policy/version/latest" && method === "GET")
        return withCors(await getLatestPolicy(env), request, env);

      if (pathname === "/api/policy/version/list" && method === "GET")
        return withCors(await listPolicyVersions(env), request, env);

      if (pathname === "/api/policy/accept" && method === "POST")
        return withCors(await acceptPolicy(request, env), request, env);

      if (pathname === "/api/policy/status" && method === "GET")
        return withCors(await getPolicyStatus(request, env), request, env);

      /* ======================================================
         BUSINESS
      ====================================================== */
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

      /* ======================================================
         PRODUCTS
      ====================================================== */
      if (pathname === "/api/products" && method === "GET")
        return withCors(json({ ok: true, products: await getProducts(env) }, request, env), request, env);

      if (pathname === "/api/product" && method === "GET")
        return withCors(json({ ok: true, product: await getProduct(request, env) }, request, env), request, env);

      if (pathname === "/api/products/register" && method === "PUT")
        return withCors(json({ ok: true, product: await registerProduct(request, env) }, request, env), request, env);

      /* ======================================================
         ADMIN — READ
      ====================================================== */
      if (pathname === "/api/admin/orders/list" && method === "GET") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied, request, env);
        return withCors(await listAdminOrders(request, env), request, env);
      }

      if (pathname === "/api/admin/order" && method === "GET") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied, request, env);
        return withCors(await getAdminOrderAdmin(request, env), request, env);
      }

      if (pathname === "/api/admin/users/list" && method === "GET") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied, request, env);
        return withCors(await listAdminUsers(request, env), request, env);
      }

      /* ======================================================
         ADMIN — WRITE
      ====================================================== */
      if (pathname === "/api/admin/order/transition" && method === "POST") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied, request, env);
        return withCors(await transitionOrder(request, env), request, env);
      }

      if (pathname === "/api/admin/order/delete" && method === "POST") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied, request, env);
        return withCors(await deleteOrder(request, env), request, env);
      }

      if (pathname === "/api/admin/order/clone" && method === "POST") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied, request, env);
        return withCors(await cloneOrder(request, env), request, env);
      }

      /* ======================================================
         ADMIN — KPI
      ====================================================== */
      if (pathname === "/api/admin/kpi" && method === "GET") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied, request, env);
        return withCors(await getAdminKPI(request, env), request, env);
      }

      /* ===================== FALLBACK ===================== */
      return json({ ok: false, error: "NOT_FOUND" }, request, env, 404);

    } catch (err) {
      console.error("UNHANDLED ERROR:", err);
      return json({ ok: false, error: "INTERNAL_ERROR" }, request, env, 500);
    }
  },
};
