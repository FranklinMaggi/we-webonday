// ======================================================
// BE || REFERRAL — DOMAIN ROUTER
// ======================================================
//
// RUOLO:
// - Routing centralizzato delle API Referral
// - Solo USER routes (per ora)
//
// CONTRATTO:
// - Ritorna Response se matcha
// - Ritorna null se non è Referral
//
// NON DEVE:
// - contenere logica di dominio
// - accedere direttamente a KV
// ======================================================

import type { Env } from "../../types/env";
import { withCors } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

import {
  createReferralHandler,
  getMyReferral,
} from "./routes/referral";

export async function handleReferralRoutes(
  request: Request,
  env: Env
): Promise<Response | null> {
  const { pathname } = new URL(request.url);
  const method = request.method;

  /* ======================================================
     USER — REFERRAL
  ====================================================== */

  if (pathname === "/api/referral/create" && method === "POST") {
    return withCors(
      await createReferralHandler(request, env),
      request,
      env
    );
  }

  if (pathname === "/api/referral/mine" && method === "GET") {
    return withCors(
      await getMyReferral(request, env),
      request,
      env
    );
  }

  return null;
}