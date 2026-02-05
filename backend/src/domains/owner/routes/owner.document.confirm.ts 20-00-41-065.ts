// ======================================================
// BE || OWNER || DOCUMENT || CONFIRM
// POST /api/owner/document/confirm
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "types/env";

export async function confirmOwnerDocumentUpload(
  request: Request,
  env: Env
): Promise<Response> {
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const body = await request.json() as {
    configurationId?: string;
    side?: "front" | "back";
    objectKey?: string;
  };

  const { configurationId, side, objectKey } = body;

  if (!configurationId || !side || !objectKey) {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }

  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as any;

  if (!configuration || configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  const ownerId = configuration.ownerId;
  if (!ownerId) {
    return json({ ok: false, error: "OWNER_NOT_FOUND" }, request, env, 409);
  }
  

  /* =====================
     CHECK OBJECT EXISTS
  ====================== */
  const object = await env.USER_IMAGES.head(objectKey);
  if (!object) {
    return json(
      { ok: false, error: "OBJECT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     LOAD OWNER DRAFT
  ====================== */
  const ownerKey = `OWNER:${ownerId}`;
  const raw = await env.BUSINESS_KV.get(ownerKey);
  if (!raw) {
    return json(
      { ok: false, error: "OWNER_DRAFT_MISSING" },
      request,
      env,
      409
    );
  }

  const ownerDraft = JSON.parse(raw);

  ownerDraft.documents = {
    ...ownerDraft.documents,
    [side]: {
      key: objectKey,
      uploadedAt: new Date().toISOString(),
      verified: false,
    },
  };

  ownerDraft.updatedAt = new Date().toISOString();

  await env.BUSINESS_KV.put(
    ownerKey,
    JSON.stringify(ownerDraft)
  );

  return json({ ok: true }, request, env);
}
