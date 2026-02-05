// ======================================================
// BE || OWNER || DOCUMENT || UPLOAD (CONFIGURATION-BASED)
// POST /api/owner/document/upload
// ======================================================
//
// RUOLO:
// - Upload documenti owner PRIMA della verifica
// - I documenti sono legati alla CONFIGURATION
// - Nessun Owner richiesto in questa fase
//
// INVARIANTI:
// - Auth obbligatoria
// - Ownership su Configuration
// - MIME ristretto (img)
// - Upload idempotente (sovrascrive stesso side)
// - VALIDAZIONE ZOD CANONICA (OwnerDocumentsSchema)
//
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "types/env";

import { OwnerDocumentsSchema } from "../schema/owner.document.schema";
import { OWNER_KEY , OWNER_DOCUMENTS_KEY } from "../keys";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];


export async function uploadOwnerDocument(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }
  const userId = session.user.id; 

  /* =====================
     2️⃣ INPUT (MULTIPART)
  ====================== */
  const form = await request.formData();

  const file = form.get("file") as File | null;
  const side = form.get("side") as "front" | "back" | null;
  const configurationId =
    form.get("configurationId") as string | null;

  if (!file || !side || !configurationId) {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }

  if (!ALLOWED_MIME.includes(file.type)) {
    return json(
      { ok: false, error: "INVALID_MIME_TYPE" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ OWNERSHIP CONFIGURATION
  ====================== */
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

  /* =====================
     4️⃣ BUILD R2 OBJECT KEY
  ====================== */
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
      ? "webp"
      : "jpg";

  const objectKey =
    `configuration/${configurationId}/owner/document-${side}.${ext}`;

  /* =====================
     5️⃣ UPLOAD SU R2
  ====================== */
  await env.USER_IMAGES.put(
    objectKey,
    file.stream(),
    {
      httpMetadata: {
        contentType: file.type,
      },
    }
  );

  /* =====================
     6️⃣ VALIDATE + SAVE METADATA (KV)
     🔒 ZOD = DOMINIO BLINDATO
  ====================== */
  const now = new Date().toISOString();
  const kvKey = OWNER_DOCUMENTS_KEY(userId); // ✅ user-scoped

  // 🔹 carico stato esistente (se presente)
  const existingRaw =
    await env.BUSINESS_KV.get(kvKey, "json");

  // 🔹 valido struttura esistente (o vuota)
  const existing = OwnerDocumentsSchema.parse(
    existingRaw ?? {}
  );

  // 🔹 costruisco nuovo stato
  const next = OwnerDocumentsSchema.parse({
    ...existing,
    [side]: {
      type:
        side === "front"
          ? "identity_card_front"
          : "identity_card_back",
      format: "img",
      url: `${env.R2_PUBLIC_BASE_URL}/${objectKey}`,
      size: file.size,
      verificationStatus: "pending",
      uploadedAt: now,
    },
  });

  // 🔹 persistenza sicura
  await env.BUSINESS_KV.put(
    kvKey,
    JSON.stringify(next),
    {
      metadata: {
        type: "owner_documents",
        configurationId,
        userId: session.user.id,
      },
    }
  );

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      side,
      objectKey,
    },
    request,
    env
  );
}
