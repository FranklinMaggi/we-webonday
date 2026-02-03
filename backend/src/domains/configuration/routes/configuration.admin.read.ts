// ======================================================
// BE || CONFIGURATION — ADMIN READ (GLOBAL)
// ======================================================
//
// ENDPOINT:
// - GET /api/admin/configuration
//
// RUOLO:
// - Visualizzazione tecnica globale delle Configuration
// - Audit / Debug / Recovery
//
// INVARIANTI:
// - Solo admin
// - Read-only
// - Configuration = workspace tecnico
// - complete è DERIVATO
// ======================================================

import type { Env } from "../../../types/env";
import { requireAdmin } from "@domains/auth/route/admin/guard/admin.guard";
import { json } from "@domains/auth/route/helper/https";

import type { ConfigurationDTO } from "../schema/configuration.schema";

/* ======================================================
   GET /api/admin/configuration
====================================================== */
export async function listAllConfigurations(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH — ADMIN
  ====================== */
  const admin = await requireAdmin(request, env);
  if (!admin) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  /* =====================
     2️⃣ LIST CONFIGURATION KEYS
  ====================== */
  const { keys } = await env.CONFIGURATION_KV.list({
    prefix: "CONFIGURATION:",
  });

  /* =====================
     3️⃣ LOAD CONFIGURATIONS
  ====================== */
  const items = (
    await Promise.all(
      keys.map((k) =>
        env.CONFIGURATION_KV.get(
          k.name,
          "json"
        ) as Promise<ConfigurationDTO | null>
      )
    )
  ).filter(Boolean);

  /* =====================
     4️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      count: items.length,
      items,
    },
    request,
    env
  );
}