// ======================================================
// BE || ADMIN || CONFIGURATION || REJECT
// POST /api/admin/configuration/reject
// ======================================================

import type { Env } from "types/env";
import { json } from "@domains/auth/route/helper/https";
import { requireAdmin } from "@domains/auth/route/admin/guard/admin.guard";
import { z } from "zod";

/* =========================
   INPUT
========================= */
const RejectSchema = z.object({
  configurationId: z.string().min(1),
  reason: z.string().min(3).optional(), // audit opzionale
});

export async function rejectConfiguration(
  request: Request,
  env: Env
): Promise<Response> {
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  let body;
  try {
    body = RejectSchema.parse(await request.json());
  } catch {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }

  const { configurationId, reason } = body;

  const key = `CONFIGURATION:${configurationId}`;
  const raw = await env.CONFIGURATION_KV.get(key);

  if (!raw) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const cfg = JSON.parse(raw);

  /* =========================
     STATE GUARD
  ========================= */
  if (cfg.status !== "CONFIGURATION_IN_PROGRESS") {
    return json(
      {
        ok: false,
        error: "INVALID_STATE",
        status: cfg.status,
      },
      request,
      env,
      409
    );
  }

  /* =========================
     UPDATE
  ========================= */
  const updated = {
    ...cfg,
    status: "REJECTED",
    rejectionReason: reason ?? null,
    updatedAt: new Date().toISOString(),
  };

  await env.CONFIGURATION_KV.put(key, JSON.stringify(updated));

  return json(
    {
      ok: true,
      status: "REJECTED",
    },
    request,
    env
  );
}
