// ======================================================
// ADMIN — PROJECTS (READ)
// LIST ALL PROJECTS (ALL BUSINESSES)
// ======================================================
//
// RESPONSABILITÀ:
// - Listing globale progetti
// - Vista admin / dashboard
//
// NON FA:
// - Nessuna mutazione
// - Nessuna logica di business
// ======================================================

import type { Env } from "../../../types/env";
import { ProjectSchema } from "../../../schemas/core/projectSchema";
import { requireAdmin } from "../admin.guard";

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
   GET /api/admin/projects/list
====================================================== */
export async function listAdminProjects(
  request: Request,
  env: Env
): Promise<Response> {
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  const list = await env.PROJECTS_KV.list({ prefix: "PROJECT:" });

  const projects = [];

  for (const key of list.keys) {
    const raw = await env.PROJECTS_KV.get(key.name);
    if (!raw) continue;

    try {
      const project = ProjectSchema.parse(JSON.parse(raw));
      projects.push(project);
    } catch (err) {
      console.error("INVALID_PROJECT_IN_KV:", key.name, err);
    }
  }

  projects.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return json({ ok: true, projects });
}
