// ======================================================
// BE || routes/projects/projects.list.ts
// GET PROJECT LIST BY BUSINESS
// ======================================================
/* =========================================================
   AI-SUPERCOMMENT — PROJECT LIST (BY BUSINESS)
   =========================================================
   SCOPO:
   - Listare TUTTI i Project di un business

   KV:
   - PROJECTS_KV
   - prefix PROJECT:{businessId}:

   INVARIANTI:
   - Nessuna scrittura
   - Nessuna logica di stato
   - Errori di parsing NON bloccano la lista

   ORDINAMENTO:
   - updatedAt DESC (più recenti prima)
========================================================= */

import type { Env } from "../../../types/env";
import { ProjectSchema, Project } from "../../../domains/project/project.schema";
import { PROJECTS_BY_BUSINESS_PREFIX } from "../../../lib/kv";

export async function listProjects(request: Request, env: Env) {
  const url = new URL(request.url);
  const businessId = url.searchParams.get("businessId");

  if (!businessId) {
    throw new Error("MISSING_BUSINESS_ID");
  }

  const prefix = PROJECTS_BY_BUSINESS_PREFIX(businessId);

  const list = await env.PROJECTS_KV.list({ prefix });

  const projects: Project[] = [];

  for (const key of list.keys) {
    const raw = await env.PROJECTS_KV.get(key.name);
    if (!raw) continue;

    try {
      const parsed = ProjectSchema.parse(JSON.parse(raw));
      projects.push(parsed);
    } catch (err) {
      console.error("Invalid project in KV:", key.name, err);
    }
  }

  // 🔽 ordinamento a valle
  projects.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime()
  );

  return { ok: true, projects };
}
