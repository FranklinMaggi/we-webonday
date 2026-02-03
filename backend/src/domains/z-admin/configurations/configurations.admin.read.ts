// backend/src/routes/admin/configurations/configurations.admin.read.ts
// ======================================================
// BE || ADMIN || CONFIGURATION — READ
// ======================================================

import type { Env } from "../../../types/env";
import { requireAdmin } from "../../auth/route/admin/guard/admin.guard";
import { json } from "../../auth/route/helper/https";

const CONFIGURATION_KEY = (id: string) => `CONFIGURATION:${id}`;
const OWNER_DRAFT_KEY = (id: string) => `OWNER_DRAFT:${id}`;
const BUSINESS_KEY = (id: string) => `BUSINESS:${id}`;

export async function getAdminConfiguration(
  request: Request,
  env: Env
): Promise<Response> {

  /* 🔒 ADMIN GUARD */
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return json({ ok: false, error: "MISSING_CONFIGURATION_ID" }, request, env, 400);
  }

  /* =====================
     LOAD CONFIGURATION
  ====================== */
  const rawConfig = await env.CONFIGURATION_KV.get(CONFIGURATION_KEY(id));
  if (!rawConfig) {
    return json({ ok: false, error: "CONFIGURATION_NOT_FOUND" }, request, env, 404);
  }

  const configuration = JSON.parse(rawConfig);

/* =====================
   LOAD OWNER DRAFT (SOURCE OF TRUTH)
===================== */
let owner = null;

const ownerDraftKey = `BUSINESS_OWNER_DRAFT:${configuration.userId}`;
const rawOwnerDraft = await env.BUSINESS_KV.get(ownerDraftKey);

if (rawOwnerDraft) {
  owner = JSON.parse(rawOwnerDraft);
}
  /* =====================
     LOAD BUSINESS
  ====================== */
  let business = null;
  if (configuration.businessDraftId) {
    const rawBusiness = await env.BUSINESS_KV.get(
      BUSINESS_KEY(configuration.businessDraftId)
    );
    if (rawBusiness) {
      business = JSON.parse(rawBusiness);
    }
  }

  /* =====================
     RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      configuration: {
        id: configuration.id,
        status: configuration.status,
        createdAt: configuration.createdAt,
        updatedAt: configuration.updatedAt,
      },
      owner,
      business,
    },
    request,
    env
  );
}
