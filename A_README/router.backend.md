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
import {
  getCorsHeaders,
  withCors,
  resolveAuthCorsMode,
  getUser,
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  googleCallback,
} from "@domains/auth";
/* ============================================================
 USER - CONFIGURATION _ FLOW 
============================================================ */

import { createConfigurationBase ,getUserConfiguration, listAllConfigurations ,listUserConfigurations , setConfigurationDraft ,  readConfigurationPreview} from "@domains/configuration/routes";
import { createBusinessDraft , getBusinessDraft ,UpdateBusinessDraftSchema, reopenBusinessDraft } from "@domains/business/routes";
import {
  createBusinessOwnerDraft,
  getBusinessOwnerDraft,
  initOwnerVerification,
 
 
} from "@domains/owner/routes";
/* ============================================================
   COOKIES — CONSENSO
============================================================ */

import { acceptCookies ,
  getCookieStatus } from "./domains/auth/cookies/cookies";


/* ============================================================
   PROJECT — ACTUALLY DEPRECATED
============================================================ */
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
import { attachOwnerToConfiguration } from "@domains/configuration/routes/";
import { 
  getBusiness ,
  listBusinesses ,
  submitBusiness,
  uploadBusinessMenu
} from "@domains/business/routes";
import { listAllBusinessDrafts } from "@domains/business/routes";
// ======================================================
// BE || routes/configuration/index.ts
// ======================================================


/* ============================================================
   PRODUCTS
============================================================ */
import { getProductsWithOptions } from "./domains/product/Routes/products.withOptions";
import { getProducts } from "./domains/product/Routes/products";
import { getProduct } from "./domains/product/Routes/products";
import { registerAdminProduct } from "./domains/admin/products/products.admin.register";

/* ============================================================
   ADMIN — PRODUCTS
============================================================ */
import { getProductWithOptions } from "./domains/product/Routes/product.withOptions";

import {
  listAdminProducts,
  getAdminProduct,
} from "./domains/admin/products/products.admin";
import { registerOption } from "./domains/admin/options/options.admin";
import { updateProductOptions } from "./domains/admin/products/products.options.update";

import {
  listAdminOptions,
  getAdminOption,
  updateOptionStatus,

} from "./domains/admin/options/options.read";
import { getAdminProductWithOptions } from "./domains/admin/products/products.withOptions";

/* ============================================================
   ADMIN — GUARD
============================================================ */

import { requireAdmin } from "./domains/auth/route/admin/guard/admin.guard";

/* ============================================================
   ADMIN — READ
============================================================ */
/* ============================================================
   ADMIN — CONFIGURATION
============================================================ */
import {
  getAdminConfiguration,
  listAdminConfigurations,
  acceptConfiguration,
  rejectConfiguration,
  viewConfigurationDocuments
} from "./domains/admin/configurations";

import { listAdminOrders } from "./domains/admin/orders/orders.admin";
import { getAdminOrder as getAdminOrderAdmin } from "./domains/admin/orders/orders.admin";

import { listAdminUsers } from "./domains/admin/users/user.read";

/* ============================================================
   ADMIN — WRITE (STATE MACHINE)
============================================================ */
import {
  transitionOrder,
  deleteOrder,
  cloneDeletedOrder,
} from "./domains/admin/orders/orders.actions";

/* ============================================================
   ADMIN — KPI
============================================================ */
import { commitConfigurationRoute} from "@domains/configuration/routes";

import { getAdminKPI } from "./domains/admin/kpi/kpi.read";

import {  listAdminSolutions,
  getAdminSolution,
  registerSolution, } from "./domains/solution/routes/admin.solution.operation";
import { getSolutionDetail } from "./domains/solution/routes/solutions.public.detail";
import { getSolutions } from "./domains/solution/routes/solutions.public.list";

// OWNER — DOCUMENTS
import {
  uploadOwnerDocument ,
  uploadBusinessDocument ,
  confirmOwnerDocumentUpload ,
  viewOwnerDocument,} from "@domains/owner/routes"


  import {
    initBusinessVerification, // ⬅️ AGGIUNGI QUESTA
  } from "@domains/business/routes";
import { getBusinessPreview } from "@domains/site-preview/routes/business.preview";
/* ============================================================
   HTTP HELPERS
============================================================ */

import { json } from "./domains/auth/route/helper/https";


/* ============================================================
   WORKER ENTRYPOINT
============================================================ */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const method = request.method;

    if (method === "OPTIONS") {
      const mode = pathname.startsWith("/api/user/")
        ? resolveAuthCorsMode(pathname)
        : "SOFT";
    
      return new Response(null, {
        status: 204,
        headers: new Headers(
          getCorsHeaders(request, env, mode)
        ),
      });
    }
    

     function handleAuth(
      pathname: string,
      method: string,
      request: Request,
      env: Env
    ): Promise<Response> | null {
      if (pathname === "/api/user/google/auth" && method === "GET")
        return googleAuth(request, env);
    
      if (pathname === "/api/user/google/callback" && method === "GET")
        return googleCallback(request, env);
    
      if (pathname === "/api/user/me" && method === "GET")
        return getUser(request, env);
    
      if (pathname === "/api/user/register" && method === "POST")
        return registerUser(request, env);
    
      if (pathname === "/api/user/login" && method === "POST")
        return loginUser(request, env);
    
      if (pathname === "/api/user/logout" && method === "POST")
        return logoutUser(request, env);
    
      return null;
    }

    
    try {


  /* ======================================================
    AUTH
  ====================================================== */
          const authResponse = await handleAuth(
            pathname,
            method,
            request,
            env
          );

          if (authResponse) {
            return withCors(authResponse, request, env);
          }

/* ======================================================
   SOLUTIONS — PUBLIC
====================================================== */

if (pathname === "/api/solution/list" && method === "GET") {
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
         CART
      ====================================================== */
      if (pathname === "/api/cart" && method === "GET")
        return withCors(await getCart(request, env), request, env);
      
      if (pathname === "/api/cart" && method === "PUT")
        return withCors(await putCart(request, env), request, env);
      
      if (pathname === "/api/cart" && method === "DELETE")
        return withCors(await deleteCart(request, env), request, env);
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
      if (pathname === "/api/business/create-draft" && method === "POST")
        return withCors(
          await createBusinessDraft(request, env),
          request,
          env
        );
// READ (prefill BusinessForm)
if (pathname === "/api/business/get-base-draft" && method === "GET") {
  return withCors(
    await getBusinessDraft(request, env),
    request,
    env
  );
}
if (pathname === "/api/business/draft/get-list" && method === "GET") {
  return withCors(
    await listAllBusinessDrafts(request, env),
    request,
    env
  );
}
if (
  pathname === "/api/configuration/set-draft" &&
  method === "POST"
) {
  return withCors(
    await setConfigurationDraft(request, env),
    request,
    env
  );
}
if (
  pathname === "/api/business/reopen-draft" &&
  method === "POST"
) {
  return withCors(
    await reopenBusinessDraft(request, env),
    request,
    env
  );
}

      

      if (pathname === "/api/business" && method === "GET")
        return withCors(await listBusinesses(request, env), request, env);

      
      if (pathname.startsWith("/api/business/") && method === "GET")
        return withCors(await getBusiness(request, env), request, env);
     
      

      if (pathname === "/api/business/submit" && method === "POST")
        return withCors(await submitBusiness(request, env), request, env);

      if (pathname === "/api/business/menu/upload" && method === "POST")
        return withCors(await uploadBusinessMenu(request, env), request, env);


/* ======================================================
   CONFIGURATION — BASE(AUTH REQUIRED)
====================================================== */


if (
  pathname === "/api/configuration/base" &&
  method === "POST"
) {
  return withCors(
    await createConfigurationBase(request, env),
    request,
    env
  );
}


if (pathname === "/api/configurations/list" && method === "GET")
  return withCors(
    await listUserConfigurations(request, env),
    request,
    env
  );
/* ======================================================
   CONFIGURATION — PREVIEW (WORKSPACE)
====================================================== */
if (
  pathname.startsWith("/api/configuration/") &&
  pathname.endsWith("/preview") &&
  method === "GET"
) {
  // /api/configuration/:id/preview
  const configurationId = pathname.split("/")[3];

  return withCors(
    await readConfigurationPreview(request, env, configurationId),
    request,
    env
  );
}

  if (pathname.startsWith("/api/configuration/")) {
    const id = pathname.split("/").pop()!;
    if (method === "GET")
      return withCors(
        await getUserConfiguration(request, env, id),
        request,
        env
      );

    }

 
if (pathname === "/api/configuration/commit" && method === "POST") {
  return withCors(
    await commitConfigurationRoute(request, env),
    request,
    env
  );
}
/* ======================================================
   BUSINESS — OWNER (DRAFT)
====================================================== */

if (
  pathname === "/api/owner/create-draft" &&
  method === "POST"
) {
  return withCors(
    await createBusinessOwnerDraft(request, env),
    request,
    env
  );
}
if (
  pathname === "/api/owner/get-draft" &&
  method === "GET"
) {
  return withCors(
    await getBusinessOwnerDraft(request, env),
    request,
    env
  );
}

if (
  pathname === "/api/owner/verification/init" &&
  method === "POST"
) {
  return withCors(
    await initOwnerVerification(request, env),
    request,
    env
  );
}
// ======================================================
// BUSINESS || VERIFICATION INIT
// ======================================================
if (
  pathname === "/api/business/verification/init" &&
  method === "POST"
) {
  return withCors(
    await initBusinessVerification(request, env),
    request,
    env
  );
}

// ======================================================
// BUSINESS || CONFIGURATION || ATTACH OWNER
// ======================================================
if (
  pathname === "/api/business/configuration/attach-owner" &&
  method === "POST"
) {
  return withCors(
    await attachOwnerToConfiguration(request, env),
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


      /* ======================================================
   ADMIN — CONFIGURATION (READ)
====================================================== */

// LIST
if (
  pathname === "/api/admin/configurations/list" &&
  method === "GET"
) {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);

  return withCors(
    await listAdminConfigurations(request, env),
    request,
    env
  );
}

// DETAIL
if (
  pathname === "/api/admin/configuration" &&
  method === "GET"
) {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);

  return withCors(
    await getAdminConfiguration(request, env),
    request,
    env
  );
}

if (
  pathname === "/api/admin/configuration/view-documents" &&
  method === "GET"
) {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);

  return withCors(
    await viewConfigurationDocuments(request, env),
    request,
    env
  );
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
        return withCors(await cloneDeletedOrder(request, env), request, env);
      }

      /* ======================================================
   ADMIN — CONFIGURATION (ACTIONS)
====================================================== */

if (
  pathname === "/api/admin/configuration/accept" &&
  method === "POST"
) {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);

  return withCors(
    await acceptConfiguration(request, env),
    request,
    env
  );
}

if (
  pathname === "/api/admin/configuration/reject" &&
  method === "POST"
) {
  const denied = requireAdmin(request, env);
  if (denied) return withCors(denied, request, env);

  return withCors(
    await rejectConfiguration(request, env),
    request,
    env
  );
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
   OWNER — DOCUMENTS (IDENTITY)
====================================================== */

if (
  pathname === "/api/owner/document/upload" &&
  method === "POST"
) {
  return withCors(
    await uploadOwnerDocument(request, env),
    request,
    env
  );
}

if (
  pathname === "/api/owner/document/confirm" &&
  method === "POST"
) {
  return withCors(
    await confirmOwnerDocumentUpload(request, env),
    request,
    env
  );
}

if (
  pathname === "/api/owner/document/view" &&
  method === "GET"
) {
  return withCors(
    await viewOwnerDocument(request, env),
    request,
    env
  );
}

/* ======================================================
   BUSINESS — DOCUMENTS
====================================================== */
if (
  pathname === "/api/business/document/upload" &&
  method === "POST"
) {
  return withCors(
    await uploadBusinessDocument(request, env),
    request,
    env
  );
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

/* ======================================================
   BUSINESS — PREVIEW (WORKSPACE / PUBLIC)
====================================================== */
if (
  pathname.startsWith("/api/user/business/") &&
  pathname.endsWith("/preview") &&
  method === "GET"
) {
  const businessId = pathname.split("/")[4]; 
  // /api/user/business/:id/preview

  return withCors(
    await getBusinessPreview(request, env, businessId),
    request,
    env
  );
}
      /* ===================== FALLBACK ===================== */
      return json({ ok: false, error: "NOT_FOUND" }, request, env, 404);

    } catch (err) {
      console.error("UNHANDLED ERROR:", err);
      return json({ ok: false, error: "INTERNAL_ERROR" }, request, env, 500);
    }
  },
};
