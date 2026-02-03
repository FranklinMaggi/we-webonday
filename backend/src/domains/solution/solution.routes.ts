// ======================================================
// BE || SOLUTION — DOMAIN ROUTER
// ======================================================
//
// RUOLO:
// - Routing centralizzato di TUTTE le API Solution
// - Public (catalogo / detail)
// - Admin (CRUD)
//
// CONTRATTO:
// - Ritorna Response se matcha una route
// - Ritorna null se NON è una route Solution
//
// NON DEVE:
// - contenere logica di dominio
// - validare dati
// - accedere direttamente a KV
// ======================================================

import type { Env } from "../../types/env";
import { withCors } from "@domains/auth";

import {
  listAdminSolutions,
  getAdminSolution,
  registerSolution,
  getSolutions,
  getSolutionDetail,
} from "./routes";

import { json } from "@domains/auth/route/helper/https";

export async function handleSolutionRoutes(
  request: Request,
  env: Env
): Promise<Response | null> {
  const { pathname } = new URL(request.url);
  const method = request.method;

  /* ======================================================
     PUBLIC — SOLUTIONS
  ====================================================== */

  if (pathname === "/api/solution/list" && method === "GET") {
    const result = await getSolutions(env);
    return withCors(json(result, request, env, 200), request, env);
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
     ADMIN — SOLUTIONS
  ====================================================== */

  if (
    pathname === "/api/admin/solutions/list" &&
    method === "GET"
  ) {
    return withCors(
      await listAdminSolutions(request, env),
      request,
      env
    );
  }

  if (
    pathname === "/api/admin/solution" &&
    method === "GET"
  ) {
    return withCors(
      await getAdminSolution(request, env),
      request,
      env
    );
  }

  if (
    pathname === "/api/admin/solutions/register" &&
    method === "PUT"
  ) {
    return withCors(
      await registerSolution(request, env),
      request,
      env
    );
  }

  return null;
}