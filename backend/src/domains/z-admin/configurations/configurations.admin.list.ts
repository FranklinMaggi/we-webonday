// ======================================================
// BE || ADMIN || CONFIGURATION — LIST
// ======================================================

import type { Env } from "../../../types/env";
import { requireAdmin } from "../../auth/route/admin/guard/admin.guard";
import { json } from "../../auth/route/helper/https";

const CONFIGURATION_PREFIX = "CONFIGURATION:";

export async function listAdminConfigurations(
  request: Request,
  env: Env
): Promise<Response> {

  /* 🔒 ADMIN GUARD */
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  /* =====================
     LIST ALL CONFIGURATIONS
  ====================== */
  const { keys } = await env.CONFIGURATION_KV.list({
    prefix: CONFIGURATION_PREFIX,
  });

  const configurations = [];

  for (const key of keys) {
    const raw = await env.CONFIGURATION_KV.get(key.name);
    if (!raw) continue;

    try {
      const cfg = JSON.parse(raw);

      configurations.push({
        id: cfg.id,
        status: cfg.status,
        userId: cfg.userId,
        businessDraftId: cfg.businessDraftId,
        ownerDraftId: cfg.ownerDraftId,
        createdAt: cfg.createdAt,
        updatedAt: cfg.updatedAt,
      });
    } catch {
      // ignora record corrotti
    }
  }

  /* =====================
     RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      configurations,
    },
    request,
    env
  );
}
