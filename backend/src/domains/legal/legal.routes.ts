// ======================================================
// BE || LEGAL — DOMAIN ROUTER
// ======================================================
//
// RUOLO:
// - Routing centralizzato del dominio LEGAL
// - Cookie / Policy / Visitor / Activity
//
// CONTRATTO:
// - Ritorna Response se matcha
// - Ritorna null se non è LEGAL
//
// NON DEVE:
// - contenere logica di dominio
// - conoscere KV
// ======================================================

import type { Env } from "../../types/env";
import { withCors } from "@domains/auth";

/* =========================
   COOKIES
========================= */
import {
  acceptCookies,
  getCookieStatus,
} from "./cookies/cookies";

/* =========================
   POLICY
========================= */
import {
  registerPolicyVersion,
  listPolicyVersions,
  getLatestPolicy,
  acceptPolicy,
  getPolicyStatus,
} from "./policy";

/* ======================================================
   ROUTER
====================================================== */
export async function handleLegalRoutes(
  request: Request,
  env: Env
): Promise<Response | null> {
  const { pathname } = new URL(request.url);
  const method = request.method;

  /* =========================
     COOKIES (PUBLIC)
  ========================= */

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

  /* =========================
     POLICY — USER
  ========================= */

  if (pathname === "/api/policy/version/latest" && method === "GET") {
    return withCors(
      await getLatestPolicy(request, env),
      request,
      env
    );
  }

  if (pathname === "/api/policy/accept" && method === "POST") {
    return withCors(
      await acceptPolicy(request, env),
      request,
      env
    );
  }

  if (pathname === "/api/policy/status" && method === "GET") {
    return withCors(
      await getPolicyStatus(request, env),
      request,
      env
    );
  }

  /* =========================
     POLICY — ADMIN
  ========================= */

  if (
    pathname === "/api/policy/version/register" &&
    method === "POST"
  ) {
    return withCors(
      await registerPolicyVersion(request, env),
      request,
      env
    );
  }

 

  return null;
}