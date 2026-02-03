// ======================================================
// BE || PRODUCT — DOMAIN ROUTER
// ======================================================
//
// RUOLO:
// - Routing centralizzato di TUTTE le API Product
// - Public only (per ora)
// - Admin rimane legacy ma isolato
//
// CONTRATTO:
// - Ritorna Response se matcha
// - Ritorna null se non è Product
// ======================================================

import type { Env } from "../../types/env";
import { withCors } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

// PUBLIC

import { getProductsWithOptions } from "./Routes/products.withOptions";
import { getProductWithOptions } from "./Routes/product.withOptions";

export async function handleProductRoutes(
  request: Request,
  env: Env
): Promise<Response | null> {
  const { pathname } = new URL(request.url);
  const method = request.method;


  if (
    pathname === "/api/products/with-options" &&
    method === "GET"
  ) {
    return withCors(
      json(
        { ok: true, products: await getProductsWithOptions(env) },
        request,
        env
      ),
      request,
      env
    );
  }

  if (
    pathname === "/api/product/with-options" &&
    method === "GET"
  ) {
    return withCors(
      await getProductWithOptions(request, env),
      request,
      env
    );
  }

  return null;
}