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
import { handleAuthRoutes } from "@domains/auth/route";

import {getCorsHeaders,withCors,resolveAuthCorsMode,} from "@domains/auth";

import { handleReferralRoutes } from "@domains/referral/referral.routes";

/* ============================================================
 USER - CONFIGURATION _ FLOW 
============================================================ */
import { handleConfigurationRoutes } from "@domains/configuration/routes";

import { handleBusinessRoutes } from "@domains/business/business.routes";

import { handleOwnerRoutes } from "@domains/owner/onwer.routes";

/* ======================================================
   SOLUTION — DOMAIN ROUTER
====================================================== */
import { handleSolutionRoutes } from "@domains/solution/solution.routes";

/* ============================================================
   PRODUCTS
============================================================ */

import { handleProductRoutes } from "@domains/product/product.routes";
/* ============================================================
   COOKIES — CONSENSO
============================================================ */

import { acceptCookies ,
  getCookieStatus } from "./domains/legal/cookies/cookies";


/* ============================================================
   ORDERS — USER
============================================================ */

import { 
  listOrders 

 } from "./domains/order/orders";
import { getOrder } from "./domains/order/orders";
import {
  createCheckoutOrderDraft,
} from "./domains/order/orders/checkoutOrders.draft.write";

import {
  finalizeCheckoutOrder,
} from "./domains/order/orders/checkoutOrders.write";

/* ============================================================
   PAYMENT — PAYPAL
============================================================ */

import { createPaypalOrder, capturePaypalOrder } from "./domains/payment/paypal";

/* ============================================================
   POLICY — LEGALE (BLOCCANTE)
============================================================ */
import { handleLegalRoutes } from "@domains/legal/legal.routes";



import { registerAdminProduct } from "./domains/z-admin/products/products.admin.register";

/* ============================================================
   ADMIN — PRODUCTS
============================================================ */
import { handleAdminRoutes } from "@domains/z-admin/admin.routes";

/* ============================================================
   ADMIN — WRITE (STATE MACHINE)
============================================================ */
import {
  transitionOrder,
  deleteOrder,
  cloneDeletedOrder,
} from "./domains/z-admin/orders/orders.actions";


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
    

    const adminResponse = await handleAdminRoutes(request, env);
    if (adminResponse) {
      return adminResponse;
    } 
/* ======================================================
   AUTH — DOMAIN ROUTER
====================================================== */
const authResponse =
  await handleAuthRoutes(request, env);

if (authResponse) {
  return withCors(authResponse, request, env);
}

const referralResponse =
await handleReferralRoutes(request, env);

if (referralResponse) {
return referralResponse;
}
/* ======================================================
   CONFIGURATION — DOMAIN ROUTER
====================================================== */
const configurationResponse =
  await handleConfigurationRoutes(request, env);

if (configurationResponse) {
  return configurationResponse;
}

/* ======================================================
   BUSINESS — DOMAIN ROUTER
====================================================== */
const businessResponse =
  await handleBusinessRoutes(request, env);

if (businessResponse) {
  return businessResponse;
}

/* ======================================================
   OWNER — DOMAIN ROUTER
====================================================== */
const ownerResponse =
  await handleOwnerRoutes(request, env);

if (ownerResponse) {
  return ownerResponse;
}
const solutionResponse =
  await handleSolutionRoutes(request, env);

if (solutionResponse) {
  return solutionResponse;
}

const productResponse =
  await handleProductRoutes(request, env);

if (productResponse) {
  return productResponse;
}

/* ======================================================
POLICY DA ESTENDERE A PRIVACY POLICY E T&C POLICY 
====================================================== */

  const legalResponse =
  await handleLegalRoutes(request, env);

  if (legalResponse) {
  return legalResponse; 
  }



    try { // in fase di modifica : diventano come le funzioni sopra -> 

      /* ======================================================
      ORDERS — USER + ORDER PAYPAL _> PARZIALMEN TE PRONTO IL CODICE MA NON ANCORA COLLEGATA A CONFIGURATION 
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
        ); // -> CREA STRINGA DI ORDINE PER CHECKOUT ( CREDO IO ) 
      
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


      /* ===================== FALLBACK ===================== */
      return json({ ok: false, error: "NOT_FOUND" }, request, env, 404);

    } catch (err) {
      console.error("UNHANDLED ERROR:", err);
      return json({ ok: false, error: "INTERNAL_ERROR" }, request, env, 500);
    }
  },
};
