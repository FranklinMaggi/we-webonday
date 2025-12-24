// backend/src/index.ts
/**
 * WEBONDAY BACKEND – CORE FLOWS
 *
 * Questo backend è organizzato per DOMINI LOGICI.
 * Il frontend NON decide mai la validità di un’azione critica.
 *
 * FLUSSI CORE (ordine obbligatorio):
 *
 * 1. AUTH
 *    Visitor → OAuth / Login → Session Cookie → /api/user/me
 *
 * 2. POLICY (legale, BLOCCANTE)
 *    User loggato → GET latest → GET status → POST accept
 *    Senza policy accettata:
 *      - non si crea ordine
 *      - non si paga
 *
 * 3. CART
 *    VisitorId → sync cart → KV
 *
 * 4. ORDER
 *    User + Cart + Policy → POST /api/order → orderId
 *
 * 5. PAYMENT
 *    Order valido → PayPal create → PayPal capture
 *
 * PRINCIPI:
 * - La sessione è l’unica fonte dell’identità utente
 * - Nessun endpoint critico accetta userId dal client
 * - Il backend rifiuta sempre flussi illegali
 */


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
import { saveOrderSetup } from "./routes/orders/orderSetup";

// CART
import { saveCart, getCart } from "./routes/cart/cart";

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
} from "./routes/products/products";

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
} from "./routes/payment/paypal";

// POLICY
import {
  registerPolicyVersion,
  getLatestPolicy,
  listPolicyVersions,
  acceptPolicy,
  getPolicyStatus,
} from "./routes/policy/";

// COOKIES
import {
  acceptCookies,
  getCookieStatus,
} from "./routes/cookies/cookies";

// ADMIN
import { requireAdmin } from "./routes/admin/admin.guard";

// HTTP
import { json } from "./lib/https";

/* ============================
   CORS — SINGLE SOURCE
============================ */
/**
 * CORS — SINGLE SOURCE OF TRUTH
 *
 * Tutte le risposte passano da qui.
 * NON creare mai header CORS in altri file.
 * Qualsiasi bug di sessione/cookie parte da qui.
 */
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
/**
 * WORKER ENTRYPOINT
 *
 * Qui vengono:
 * - mappati gli endpoint
 * - applicati CORS
 * - applicati controlli di sicurezza (admin/session)
 *
 * NON inserire logica applicativa qui.
 */


export default {
  
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const method = request.method;

    /* ===== PREFLIGHT ===== 
    * Gestione CORS preflight (OPTIONS)
 * Nessuna logica applicativa qui
 */
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request, env),
      });
    }

    try {

      /* ===== AUTH ===== */
          /**
          * Flusso:
          * Visitor → OAuth/Login → Session Cookie → /api/user/me
          *
          * PRINCIPI:
          * - L'identità utente deriva SOLO dalla sessione
          * - Nessun endpoint critico accetta userId dal client
          */

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

      if (pathname === "/api/user/get" && method === "GET")
        return withCors(await getUser(request, env), request, env);

      if (pathname === "/api/user/logout" && method === "POST")
        return withCors(await logoutUser(request, env), request, env);

      /* ===== CART ===== */
/**
 * Il carrello è:
 * - anonimo
 * - basato su visitorId
 * - salvato in KV
 *
 * NON dipende dall'autenticazione.
 */

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

      /**
 * PRECONDIZIONI (verificate nel dominio):
 * - utente autenticato
 * - policy accettata
 * - carrello valido
 *
 * L'ordine è la prima entità "legale".
 */
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

     /* ===== PRODUCTS(ACCESSORIO) ===== 
     CATALOGO PRODOTTI 
     NON INFLUISCE SU POLICY , PAGAMENTO O ORDINE */
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
    /*======ORDERS SETUP (ACCESSORIO)========
    *
 * Usato per configurazioni guidate (wizard).
 * NON fa parte del checkout critico.
 * */
    if (pathname === "/api/order/setup" && method === "POST") {
      return withCors(await saveOrderSetup(request, env), request, env);
    }
      /* ===== POLICY (CORE , LEGALE , BLOCCANTE ) ===== 
      * Flusso:
 * - GET latest
 * - GET status (deriva dalla sessione)
 * - POST accept
 *
 * Senza policy accettata:
 * - NON si crea ordine
 * - NON si paga
 *
 * La policy è SEMPRE user-bound (sessione).
 */
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

      /* ===== PAYMENT / PAYPAL (CORE) =====
 *
 * PRECONDIZIONI:
 * - ordine valido
 * - policy accettata
 *
 * PayPal NON è fonte di verità:
 * è solo un provider di pagamento.
 */
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
      

     /* ===== PAYMENT / PAYPAL (CORE) =====
 *
 * PRECONDIZIONI:
 * - ordine valido
 * - policy accettata
 *
 * PayPal NON è fonte di verità:
 * è solo un provider di pagamento.
 */
      if (pathname === "/api/cookies/accept" && method === "POST")
        return withCors(await acceptCookies(request, env), request, env);

      if (pathname === "/api/cookies/status" && method === "GET")
        return withCors(await getCookieStatus(), request, env);

      /* ===== BUSINESS (DOMINIO SEPARATO) =====
 *
 * Gestione attività, menu, onboarding partner.
 * NON fa parte del checkout core.
 */
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
      /* ===== FALLBACK =====
 * Qualsiasi rotta non mappata finisce qui.
 */
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
