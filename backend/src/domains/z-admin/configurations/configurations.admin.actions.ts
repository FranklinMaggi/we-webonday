import { z } from "zod";
import { json } from "@domains/auth/route/helper/https";
import { requireAdmin } from "@domains/auth/route/admin/guard/admin.guard";
import type { Env } from "types/env";

/* =========================
   INPUT SCHEMA
========================= */
const AcceptConfigurationSchema = z.object({
  configurationId: z.string().min(1),
});

/* ======================================================
   POST /api/admin/configuration/accept
====================================================== */
export async function acceptConfiguration(
  request: Request,
  env: Env
): Promise<Response> {

  /* 🔒 ADMIN GUARD */
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  /* =====================
     PARSE BODY (SAFE)
  ====================== */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(
      { ok: false, error: "INVALID_JSON" },
      request,
      env,
      400
    );
  }

  const parsed = AcceptConfigurationSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: "INVALID_PAYLOAD",
        issues: parsed.error.format(),
      },
      request,
      env,
      400
    );
  }

  const { configurationId } = parsed.data;

  /* =====================
     LOAD CONFIGURATION
  ====================== */
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

  /* =====================
     STATE GUARD
  ====================== */
  if (cfg.status !== "CONFIGURATION_READY") {
    return json(
      {
        ok: false,
        error: "INVALID_STATE",
        currentStatus: cfg.status,
      },
      request,
      env,
      409
    );
  }

  /* =====================
     TRANSITION
  ====================== */
  cfg.status = "ACCEPTED";
  cfg.updatedAt = new Date().toISOString();

  await env.CONFIGURATION_KV.put(key, JSON.stringify(cfg));

  /* =====================
     RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      configurationId,
      status: "ACCEPTED",
    },
    request,
    env
  );
}
