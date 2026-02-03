// ======================================================
// BE || BUSINESS || DOCUMENT || UPLOAD
// POST /api/business/document/upload
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "types/env";
import { BusinessDocumentsKVSchema } from "../schema/business.document.schema";

export async function uploadBusinessDocument(
  request: Request,
  env: Env
): Promise<Response> {

  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;
  const configurationId = form.get("configurationId") as string | null;

  if (!file || !configurationId) {
    return json({ ok: false, error: "INVALID_INPUT" }, request, env, 400);
  }

  const isPdf = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");

  if (!isPdf && !isImage) {
    return json({ ok: false, error: "INVALID_FILE_TYPE" }, request, env, 400);
  }

  /* =====================
     OWNERSHIP CONFIG
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as any;

  if (!configuration || configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  /* =====================
     STORAGE TARGET
  ====================== */
  const ext = isPdf ? "pdf" : file.type.split("/")[1];
  const objectKey = `configuration/${configurationId}/business/certificate.${ext}`;

  const bucket = env.USER_IMAGES;

  await bucket.put(objectKey, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  /* =====================
     KV SAVE (OVERWRITE SAFE)
  ====================== */
  const kvKey = `BUSINESS_DOCUMENTS:${configurationId}`;
  const existingRaw = await env.BUSINESS_KV.get(kvKey, "json");

  const existing = BusinessDocumentsKVSchema.parse(existingRaw ?? {});

  // ❌ blocco overwrite solo se approved
  if (existing.certificate?.verificationStatus === "approved") {
    return json(
      { ok: false, error: "DOCUMENT_ALREADY_VERIFIED" },
      request,
      env,
      409
    );
  }

  const now = new Date().toISOString();

  const next = BusinessDocumentsKVSchema.parse({
    certificate: {
      type: "business_certificate",
      format: isPdf ? "pdf" : "img",
      url: `${env.R2_PUBLIC_BASE_URL}/${objectKey}`,
      size: file.size,
      verificationStatus: "pending",
      uploadedAt: now,
    },
  });

  await env.BUSINESS_KV.put(
    kvKey,
    JSON.stringify(next),
    {
      metadata: {
        type: "business_document",
        configurationId,
        userId: session.user.id,
      },
    }
  );
/* =====================
   UPDATE CONFIGURATION STATUS
===================== */
await env.CONFIGURATION_KV.put(
    `CONFIGURATION:${configurationId}`,
    JSON.stringify({
      ...configuration,
      status: "BUSINESS_READY",
      updatedAt: new Date().toISOString(),
    })
  );
  return json({ ok: true }, request, env);
}
