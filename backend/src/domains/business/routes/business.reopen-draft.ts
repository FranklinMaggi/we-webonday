// ======================================================
// BE || BUSINESS || REOPEN DRAFT
// POST /api/business/reopen-draft
// ======================================================
import { z } from "zod";
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { BusinessDraftSchema } from "../schema/business.draft.schema";
import { OwnerDraftSchema } from "@domains/business/owner/shcema/owner.draft.schema";
const ReopenBusinessDraftInputSchema = z.object({
    configurationId: z.string().min(1),
  });
export async function reopenBusinessDraft(
  request: Request,
  env: Env
): Promise<Response> {

  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  let configurationId: string;

  try {
    const body = ReopenBusinessDraftInputSchema.parse(
      await request.json()
    );
    configurationId = body.configurationId;
  } catch {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }
  
  if (!configurationId) {
    return json({ ok: false, error: "CONFIGURATION_ID_REQUIRED" }, request, env, 400);
  }

  /* =====================
     LOAD CONFIGURATION
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as any;

  if (!configuration || configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  const businessDraftId = configuration.businessDraftId;
  if (!businessDraftId) {
    return json({ ok: false, error: "BUSINESS_DRAFT_NOT_FOUND" }, request, env, 404);
  }

  /* =====================
     REOPEN BUSINESS DRAFT
  ====================== */
  const rawBusiness = await env.BUSINESS_KV.get(
    `BUSINESS_DRAFT:${businessDraftId}`
  );

  if (!rawBusiness) {
    return json({ ok: false, error: "BUSINESS_DRAFT_NOT_FOUND" }, request, env, 404);
  }

  const businessDraft = BusinessDraftSchema.parse(JSON.parse(rawBusiness));

  await env.BUSINESS_KV.put(
    `BUSINESS_DRAFT:${businessDraftId}`,
    JSON.stringify({
      ...businessDraft,
      complete: false,
      updatedAt: new Date().toISOString(),
    })
  );

  /* =====================
     REOPEN OWNER DRAFT
  ====================== */
  const ownerKey = `BUSINESS_OWNER_DRAFT:${session.user.id}`;
  const rawOwner = await env.BUSINESS_KV.get(ownerKey);

  if (rawOwner) {
    const ownerDraft = OwnerDraftSchema.parse(JSON.parse(rawOwner));

    await env.BUSINESS_KV.put(
      ownerKey,
      JSON.stringify({
        ...ownerDraft,
        complete: false,
       
        updatedAt: new Date().toISOString(),
      })
    );
  }

  /* =====================
     RESET CONFIGURATION STATUS
  ====================== */
  await env.CONFIGURATION_KV.put(
    `CONFIGURATION:${configurationId}`,
    JSON.stringify({
      ...configuration,
      status: "DRAFT",
      updatedAt: new Date().toISOString(),
    })
  );

  return json({ ok: true }, request, env);
}
