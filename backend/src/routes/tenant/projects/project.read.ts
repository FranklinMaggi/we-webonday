// ======================================================
// BE || routes/projects/project.read.ts
// GET SINGLE PROJECT
// ======================================================
// ======================================================
// AI-SUPERCOMMENT
// PROJECT || READ SINGLE
// ======================================================
//
// SCOPO:
// - Lettura di UN singolo project
//
// INVARIANTI:
// - projectId deterministico
// - PROJECTS_KEY(businessId, projectId)
//
// NOTE:
// - Nessun listing
// - Nessun sorting
// ======================================================

import type { Env } from "../../../types/env";
import { ProjectSchema } from "../../../domains/project/project.schema";
import { PROJECTS_KEY } from "../../../lib/kv";

export async function getProject(request: Request, env: Env) {
  const url = new URL(request.url);
  const businessId = url.searchParams.get("businessId");
  const projectId = url.searchParams.get("projectId");

  if (!businessId || !projectId) {
    throw new Error("MISSING_PARAMS");
  }

  const raw = await env.PROJECTS_KV.get(
    PROJECTS_KEY(businessId, projectId)
  );

  if (!raw) throw new Error("PROJECT_NOT_FOUND");

  const project = ProjectSchema.parse(JSON.parse(raw));
  return { ok: true, project };
}
