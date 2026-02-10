// ======================================================
// BE || PRESET — DOMAIN ROUTER
// ======================================================
//
// RUOLO:
// - Routing centralizzato API Preset
// - SOLO public per ora
//
// CONTRATTO:
// - Ritorna Response se matcha
// - Ritorna null se non è Preset
//
// ======================================================

import type { Env } from "../../types/env";
import { withCors } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

import { listPresetsBySolution } from "./routes";

export async function handlePresetRoutes(
  request: Request,
  env: Env
): Promise<Response | null> {
  const { pathname } = new URL(request.url);
  const method = request.method;

  /* ======================================================
     PUBLIC — PRESETS BY SOLUTION
  ====================================================== */

  if (pathname === "/api/preset/list" && method === "GET") {
    const result = await listPresetsBySolution(request, env);

    const status = result.ok
      ? 200
      : result.error === "MISSING_SOLUTION_ID"
      ? 400
      : 500;

    return withCors(
      json(result, request, env, status),
      request,
      env
    );
  }

  return null;
}
