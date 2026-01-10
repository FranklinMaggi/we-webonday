// ======================================================
// BE || routes/projects/projects.read.ts
// LIST PROJECTS BY BUSINESS
// ======================================================

// ======================================================
// AI-SUPERCOMMENT
// PROJECT || LIST BY BUSINESS
// ======================================================
//
// SCOPO:
// - Listare TUTTI i project di un business
// - Basato esclusivamente su KV prefix
//
// INVARIANTI:
// - PROJECTS_KEY deve iniziare con PROJECTS_BY_BUSINESS_PREFIX
// - Nessuna paginazione (per ora)
//
// NOTE:
// - Ordine non garantito da KV → sorting applicato a valle
// - Errori di parsing NON bloccano la lista
// ======================================================

import type { Env } from "../../../types/env";
import { ProjectSchema } from "../../../domains/project/project.schema";
import { PROJECTS_BY_BUSINESS_PREFIX } from "../../../lib/kv";

export async function listProjects(request: Request, env: Env) {
  const businessId = new URL(request.url).searchParams.get("businessId");
  if (!businessId) throw new Error("MISSING_BUSINESS_ID");

  const list = await env.PROJECTS_KV.list({
    prefix: PROJECTS_BY_BUSINESS_PREFIX(businessId),
  });

  const projects = [];

  for (const key of list.keys) {
    const raw = await env.PROJECTS_KV.get(key.name);
    if (!raw) continue;

    try {
      const parsed = ProjectSchema.parse(JSON.parse(raw));
      projects.push(parsed);
    } catch (err) {
      console.error("INVALID_PROJECT", key.name, err);
    }
  }
  projects.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return { ok: true, projects };
}
