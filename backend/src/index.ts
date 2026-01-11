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


// import
import { startProject } from "./routes/tenant/projects/project.start";
import { progressProject } from "./routes/tenant/projects/project.progress";
import { completeProject } from "./routes/tenant/projects/project.complete";
import { addProjectOption } from "./routes/tenant/projects/project.options.add";
import { removeProjectOption } from "./routes/tenant/projects/project.options.remove";
import { getProject } from "./routes/tenant/projects/project.read";
import { listProjects } from "./routes/tenant/projects/projects.read";

/*===================================================================
CART OPERATIONS REVIEWD VERSION V2  
=========================================================================*/

import { getCart ,putCart ,deleteCart} from "./routes/tenant/user/cart/cart.routes";

/* ============================================================
   CONFIGURATION — PRE-ORDER
============================================================ */

import {
  listUserConfigurations,
  getUserConfiguration,
  createConfiguration,
  updateConfiguration,
} from "./routes/tenant/configuration";
import { listAllConfigurations } from "./routes/tenant/configuration";

/* ============================================================
   ORDERS — USER
============================================================ */

import { listOrders } from "./routes/orders";
import { getOrder } from "./routes/orders";
import {
  createCheckoutOrderDraft,
} from "./routes/orders/checkoutOrders.draft.write";

import {
  finalizeCheckoutOrder,
} from "./routes/orders/checkoutOrders.write";

/* ============================================================
   PAYMENT — PAYPAL
============================================================ */

import { createPaypalOrder, capturePaypalOrder } from "./routes/payment/paypal";

/* ============================================================
   POLICY — LEGALE (BLOCCANTE)
============================================================ */

import { registerPolicyVersion } from "./routes/policy";
import { getLatestPolicy } from "./routes/policy";
import { acceptPolicy } from "./routes/policy";
import { getPolicyStatus } from "./routes/policy";
import { listPolicyVersions } from "./routes/policy";

/* ============================================================
   BUSINESS — USER
============================================================ */

import { createBusiness } from "./routes/tenant/business/business.create";
import { getBusiness } from "./routes/tenant/business/business.get";
import { listBusinesses } from "./routes/tenant/business/business.list";
import { submitBusiness } from "./routes/tenant/business/business.submit";
import { uploadBusinessMenu } from "./routes/tenant/business/uploadMenu";
import {
  upsertConfigurationFromBusiness,
} from "./routes/tenant/configuration/configuration.business.write";

// ======================================================
// BE || routes/configuration/index.ts
// ======================================================


/* ============================================================
   PRODUCTS
============================================================ */
import { getProductsWithOptions } from "./routes/public/products/products.withOptions";
import { getProducts } from "./routes/public/products/products";
import { getProduct } from "./routes/public/products/products";
import { registerAdminProduct } from "./routes/admin/products/products.admin.register";

/* ============================================================
   ADMIN — PRODUCTS
============================================================ */
import { getProductWithOptions } from "./routes/public/products/product.withOptions";

import {
  listAdminProducts,
  getAdminProduct,
} from "./routes/admin/products/products.admin";
import { registerOption } from "./routes/admin/options/options.admin";
import { updateProductOptions } from "./routes/admin/products/products.options.update";

import {
  listAdminOptions,
  getAdminOption,
  updateOptionStatus,
} from "./routes/admin/options/options.read";
import { getAdminProductWithOptions } from "./routes/admin/products/products.withOptions";

import { createConfigurationFromCart } from "./routes/tenant/configuration";
/* ============================================================
   COOKIES — CONSENSO
============================================================ */

import { acceptCookies } from "./routes/system/cookies/cookies";
import { getCookieStatus } from "./routes/system/cookies/cookies";

/* ============================================================
   ADMIN — GUARD
============================================================ */

import { requireAdmin } from "./routes/admin/guard/admin.guard";

/* ============================================================
   ADMIN — READ
============================================================ */

import { listAdminOrders } from "./routes/admin/orders/orders.admin";
import { getAdminOrder as getAdminOrderAdmin } from "./routes/admin/orders/orders.admin";

import { listAdminUsers } from "./routes/admin/users/user.read";

/* ============================================================
   ADMIN — WRITE (STATE MACHINE)
============================================================ */
import {
  transitionOrder,
  deleteOrder,
  cloneDeletedOrder,
} from "./routes/admin/orders/orders.actions";

/* ============================================================
   ADMIN — KPI
============================================================ */

import { getAdminKPI } from "./routes/admin/kpi/kpi.read";

import {  listAdminSolutions,
  getAdminSolution,
  registerSolution, } from "./routes/admin/solutions/solutions.admin";
import { getSolutionDetail } from "./routes/public/solutions/solutions.public.detail";
import { getSolutions } from "./routes/public/solutions/solutions.public.list";
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
   SOLUTIONS — PUBLIC
====================================================== */

if (pathname === "/api/solutions" && method === "GET") {
  const result = await getSolutions(env);

  return withCors(
    json(result, request, env, 200),
    request,
    env
  );
}

if (pathname === "/api/solution" && method === "GET") {
  const result = await getSolutionDetail(request, env);

  const status = result.ok
    ? 200
    : result.error === "SOLUTION_NOT_FOUND"
    ? 404
    : result.error === "SOLUTION_NOT_ACTIVE"
    ? 403
    : 400;

  return withCors(
    json(result, request, env, status),
    request,
    env
  );
}
/* ======================================================
   COOKIES — CONSENSO (AGGREGATO, NON BLOCCANTE)
====================================================== */

if (pathname === "/api/cookies/accept" && method === "POST") {
  return withCors(
    await acceptCookies(request, env),
    request,
    env
  );
}

if (pathname === "/api/cookies/status" && method === "GET") {
  return withCors(
    await getCookieStatus(),
    request,
    env
  );
}

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
      if (pathname === "/api/cart" && method === "GET")
        return getCart(request, env);
      
      if (pathname === "/api/cart" && method === "PUT")
        return putCart(request, env);
      
      if (pathname === "/api/cart" && method === "DELETE")
        return deleteCart(request, env);

      /* ======================================================
         ORDERS — USER
      ====================================================== */

      if (pathname === "/api/order" && method === "GET")
        return withCors(await getOrder(request, env), request, env);

      if (pathname === "/api/orders/list" && method === "GET")
        return withCors(await listOrders(request, env), request, env);
      if (pathname === "/api/orders/checkout/draft" && method === "POST")
        return withCors(
          await createCheckoutOrderDraft(request, env),
          request,
          env
        );
      
      if (pathname === "/api/orders/checkout/finalize" && method === "POST")
        return withCors(
          await finalizeCheckoutOrder(request, env),
          request,
          env
        );
      

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
        return withCors(await getLatestPolicy(request, env), request, env);
      
      if (pathname === "/api/policy/version/list" && method === "GET")
        return withCors(await listPolicyVersions(env), request, env);

      if (pathname === "/api/policy/accept" && method === "POST")
        return withCors(await acceptPolicy(request, env), request, env);

      if (pathname === "/api/policy/status" && method === "GET")
        return withCors(await getPolicyStatus(request, env), request, env);

      /* ======================================================
         BUSINESS
      ====================================================== */

      if (pathname === "/api/business/create" && method === "POST")
        return withCors(await createBusiness(request, env), request, env);
       
      if (pathname === "/api/business" && method === "GET")
        return withCors(await listBusinesses(request, env), request, env);

      
      if (pathname.startsWith("/api/business/") && method === "GET")
        return withCors(await getBusiness(request, env), request, env);
     
      

      if (pathname === "/api/business/submit" && method === "POST")
        return withCors(await submitBusiness(request, env), request, env);

      if (pathname === "/api/business/menu/upload" && method === "POST")
        return withCors(await uploadBusinessMenu(request, env), request, env);


/* ======================================================
   CONFIGURATION — FROM CART (AUTH REQUIRED)
====================================================== */


if (
  pathname === "/api/configuration/from-cart" &&
  method === "POST"
) {
  return withCors(
    await createConfigurationFromCart(request, env),
    request,
    env
  );
}

if (pathname === "/api/configuration" && method === "GET")
  return withCors(
    await listUserConfigurations(request, env),
    request,
    env
  );

if (pathname === "/api/configuration" && method === "POST")
  return withCors(
    await createConfiguration(request, env),
    request,
    env
  );

if (pathname.startsWith("/api/configuration/")) {
  const id = pathname.split("/").pop()!;
  if (method === "GET")
    return withCors(
      await getUserConfiguration(request, env, id),
      request,
      env
    );
  if (method === "PUT")
    return withCors(
      await updateConfiguration(request, env, id),
      request,
      env
    );
}

/* ======================================================
   CONFIGURATION — FROM BUSINESS (AUTH REQUIRED)
====================================================== */
if (
  pathname === "/api/configuration/from-business" &&
  method === "POST"
) {
  return withCors(
    await upsertConfigurationFromBusiness(request, env),
    request,
    env
  );
}

      /* ======================================================
         PRODUCTS
      ====================================================== */
      if (pathname === "/api/products" && method === "GET")
        return withCors(json({ ok: true, products: await getProducts(env) }, request, env), request, env);

      if (pathname === "/api/product" && method === "GET")
        return withCors(json({ ok: true, product: await getProduct(request, env) }, request, env), request, env);

      if (pathname === "/api/products/register" && method === "PUT")
        return withCors(json({ ok: true, product: await registerAdminProduct(request, env) }, request, env), request, env);


      if (pathname === "/api/products/with-options" && method === "GET") {
        return withCors( json( { ok: true, products: await getProductsWithOptions(env) },request,env),request, env );}
        if (pathname === "/api/product/with-options" && method === "GET") {
          return withCors(
            await getProductWithOptions(request, env),
            request,
            env
          );
        }
         
       


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
// ADMIN
if (pathname === "/api/admin/configuration" && method === "GET")
  return withCors(
    await listAllConfigurations(request, env),
    request,
    env
  );
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
        return withCors(await cloneDeletedOrder(request, env), request, env);
      }
      /* ======================================================
   ADMIN — SOLUTIONS (CRUD)
   🔒 x-admin-token REQUIRED
   🧠 Tutti gli stati (DRAFT / ACTIVE / ARCHIVED)
====================================================== */
      if (pathname === "/api/admin/solutions/list" && method === "GET")
      return withCors(await listAdminSolutions(request, env), request, env);

      if (pathname === "/api/admin/solution" && method === "GET")
      return withCors(await getAdminSolution(request, env), request, env);

      if (pathname === "/api/admin/solutions/register" && method === "PUT")
      return withCors(await registerSolution(request, env), request, env);
      /* ======================================================
         ADMIN — KPI
      ====================================================== */
      if (pathname === "/api/admin/kpi" && method === "GET") {
        const denied = requireAdmin(request, env);
        if (denied) return withCors(denied, request, env);
        return withCors(await getAdminKPI(request, env), request, env);
      }
/* ======================================================
  ADMIN — PRODUCTS
====================================================== */

if (pathname === "/api/admin/products/list" && method === "GET") {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);
  return withCors(await listAdminProducts(request, env), request, env);
}


if (pathname === "/api/admin/product" && method === "GET") {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);
  return withCors(await getAdminProduct(request, env), request, env);
}

/* ======================================================
   ADMIN — OPTIONS
====================================================== */

if (pathname === "/api/admin/options/register" && method === "PUT") {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);
  return withCors(await registerOption(request, env), request, env);
}

if (pathname === "/api/admin/options/list" && method === "GET") {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);
  return withCors(await listAdminOptions(request, env), request, env);
}

if (pathname === "/api/admin/option" && method === "GET") {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);
  return withCors(await getAdminOption(request, env), request, env);
}

if (pathname === "/api/admin/options/status" && method === "POST") {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);
  return withCors(await updateOptionStatus(request, env), request, env);
}
if (pathname === "/api/admin/product/with-options" && method === "GET") {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);
  return withCors(
    await getAdminProductWithOptions(request, env),
    request,
    env
  );
}
if (
  pathname === "/api/admin/product/options/update" &&
  method === "POST"
) {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);
  return withCors(
    await updateProductOptions(request, env),
    request,
    env
  );
}
if (pathname === "/api/project/start" && method === "POST")
  return withCors(json({ ok: true, ...(await startProject(request, env)) }, request, env), request, env);

if (pathname === "/api/project/progress" && method === "POST") {
  const result = await progressProject(request, env);
  return withCors(json({ ok: true, ...result }, request, env, 200), request, env);
}
if (pathname === "/api/project/complete" && method === "POST")
  return withCors(json({ ok: true, ...(await completeProject(request, env)) }, request, env), request, env);

if (pathname === "/api/project/options/add" && method === "POST")
  return withCors(json({ ok: true, ...(await addProjectOption(request, env)) }, request, env), request, env);

if (pathname === "/api/project/options/remove" && method === "POST")
  return withCors(json({ ok: true, ...(await removeProjectOption(request, env)) }, request, env), request, env);

if (pathname === "/api/project" && method === "GET")
  return withCors(json(await getProject(request, env), request, env), request, env);

if (pathname === "/api/projects" && method === "GET")
  return withCors(json(await listProjects(request, env), request, env), request, env);


      /* ===================== FALLBACK ===================== */
      return json({ ok: false, error: "NOT_FOUND" }, request, env, 404);

    } catch (err) {
      console.error("UNHANDLED ERROR:", err);
      return json({ ok: false, error: "INTERNAL_ERROR" }, request, env, 500);
    }
  },
};
