// ======================================================
// ADMIN — PROJECT (READ SINGLE)
// ======================================================
//
// RESPONSABILITÀ:
// - Lettura singolo progetto
// - Uso admin (audit / supporto)
//
// ======================================================

import type { Env } from "../../../types/env";
import { ProjectSchema } from "../../../domains/project/project.schema";
import { PROJECTS_KEY } from "../../../lib/kv";
import { requireAdmin } from "../../../domains/auth/route/admin/guard/admin.guard";
/* =========================
   JSON helper
========================= */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* ======================================================
   GET /api/admin/project?businessId=XXX&projectId=YYY
====================================================== */
export async function getAdminProject(
  request: Request,
  env: Env
): Promise<Response> {
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  const url = new URL(request.url);
  const businessId = url.searchParams.get("businessId");
  const projectId = url.searchParams.get("projectId");

  if (!businessId || !projectId) {
    return json(
      { ok: false, error: "MISSING_PARAMS" },
      400
    );
  }

  const raw = await env.PROJECTS_KV.get(
    PROJECTS_KEY(businessId, projectId)
  );

  if (!raw) {
    return json(
      { ok: false, error: "PROJECT_NOT_FOUND" },
      404
    );
  }

  try {
    const project = ProjectSchema.parse(JSON.parse(raw));
    return json({ ok: true, project });
  } catch (err) {
    console.error("CORRUPTED_PROJECT:", projectId, err);
    return json(
      { ok: false, error: "CORRUPTED_PROJECT" },
      500
    );
  }
}
