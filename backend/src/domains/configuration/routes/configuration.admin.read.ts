// ======================================================
// BE || routes/configuration/configuration.admin.ts
// ======================================================
//
// CONFIGURATION — ADMIN
//
// RUOLO:
// - Visualizzazione configurazioni (globale)
//
// ENDPOINT:
// - GET /api/admin/configuration
//
// INVARIANTI:
// - Solo admin
// - Read only
// - CONFIGURATION_KV = source of truth
// ======================================================

import type { Env } from "../../../types/env";
import { requireAdmin } from "../../auth/route/admin/guard/admin.guard";
import { configurationKey } from "..";
import { json } from "../../auth/route/helper/https";
/* ======================================================
   GET /api/admin/configuration
   LIST ALL CONFIGURATIONS
====================================================== */
export async function listAllConfigurations(
  request: Request,
  env: Env
) {
  const admin = await requireAdmin(request, env);
  if (!admin) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  const { keys } = await env.CONFIGURATION_KV.list({
    prefix: "CONFIGURATION:",
  });

  const items = await Promise.all(
    keys.map((k) =>
      env.CONFIGURATION_KV.get(k.name, "json")
    )
  );

  return json(
    {
      ok: true,
      items: items.filter(Boolean),
    },
    request,
    env
  );
}
