// backend/src/index.ts
import { saveUserCart, getUserCart, createCart, updateCart, getCart } from "./routes/cart";
import { getProducts, getProduct, registerProduct } from "./routes/products";
import { acceptPolicy, getPolicyStatus } from "./routes/policy";
import { acceptCookies, getCookieStatus } from "./routes/cookies";
import {
  registerPolicyVersion,
  getLatestPolicy,
  getPolicyVersion,
  listPolicyVersions
} from "./routes/policyVersion";
import { createOrder } from "./routes/order";
import { listOrders, getOrder } from "./routes/orders";
import { requireAdmin } from "./lib/adminAuth";
import type { Env } from "./types/env";
import { googleAuth, googleCallback, getCurrentUser } from "./routes/userGoogle";
import { createPaypalOrder, capturePaypalOrder } from "./routes/paymentPaypal";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function withCors(res: Response) {
  const headers = new Headers(res.headers);
  Object.entries(CORS_HEADERS).forEach(([k, v]) =>
    headers.set(k, v)
  );

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}


function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      // GOOGLE AUTH
      if (pathname === "/api/user/google/auth" && method === "GET") {
        return googleAuth(request, env);
      }

      if (pathname === "/api/user/google/callback" && method === "GET") {
        return withCors(await googleCallback(request, env));
      }

        // CURRENT USER SESSION
        if (pathname === "/api/user/me" && method === "GET") {
          return getCurrentUser(request, env);
        }

      // OEDER MANAGER
      if (pathname === "/api/orders/list" && method === "GET")
        return listOrders(request, env);
      
      if (pathname === "/api/orders/get" && method === "GET")
        return getOrder(request, env);
      // CART
      if (pathname === "/api/cart" && method === "POST")
        return createCart(request, env);

      if (pathname === "/api/cart" && method === "GET")
        return getCart(request, env);

      if (pathname === "/api/cart" && method === "PUT")
        return updateCart(request, env);

      // User cart
      if (pathname === "/api/cart/user" && method === "PUT") return saveUserCart(request, env);

      if (pathname === "/api/order" && method === "POST")
        return createOrder(request, env);

      if (pathname === "/api/cart/user" && method === "GET") return getUserCart(request, env);
      // POLICY VERSION
      if (pathname === "/api/policy/version/register" && method === "POST")
        return registerPolicyVersion(request, env);

      if (pathname === "/api/policy/version/latest" && method === "GET")
        return getLatestPolicy(env);

      if (pathname === "/api/policy/version/get" && method === "GET")
        return getPolicyVersion(request, env);

      if (pathname === "/api/policy/version/list" && method === "GET")
        return listPolicyVersions(env);

      // POLICY ACCEPTANCE
      if (pathname === "/api/policy/accept" && method === "POST")
        return acceptPolicy(request, env);

      if (pathname === "/api/policy/status" && method === "GET")
        return getPolicyStatus(request, env);

      // COOKIES
      if (pathname === "/api/cookies/accept" && method === "POST")
        return acceptCookies(request, env);

      if (pathname === "/api/cookies/status" && method === "GET")
        return getCookieStatus(request, env);

      // PRODUCTS
      if (pathname === "/api/products" && method === "GET")
        return getProducts(env);

      if (pathname === "/api/product" && method === "GET")
        return getProduct(request, env);

      if (pathname === "/api/products/register" && method === "PUT")
        return registerProduct(request, env);
          
      // PAYPAL STATS OF PAYMENTS
      // PAYPAL PAYMENTS
        if (pathname === "/api/payment/paypal/create-order" && method === "POST") {
          return createPaypalOrder(request, env);
        }

        if (pathname === "/api/payment/paypal/capture-order" && method === "POST") {
          return capturePaypalOrder(request, env);
        }

      
      // Admin orders list
if (pathname === "/api/admin/orders/list") {
  const denied = requireAdmin(request, env);
  if (denied) return denied;
  return listOrders(request, env);
}

// Admin get order
if (pathname === "/api/admin/orders/get" && method === "GET") {
  const denied = requireAdmin(request, env);
  if (denied) return denied;
  return getOrder(request, env);
}



      return new Response("Not Found", { status: 404, headers: CORS_HEADERS });

    } catch (err: any) {
      return json({ ok: false, error: err.message ?? "Unknown error" }, 500);
    }
  },
};
