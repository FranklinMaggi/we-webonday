// backend/src/routes/uploadBusinessMenu.ts

import type { Env } from "../../types/env";

import { BusinessSchema } from "../../schemas/business/businessSchema";
import { BUSINESS_KEY } from "../../lib/kv";

import { getUserFromSession } from "../../lib/auth/session";
import { json } from "../../lib/https";

/* ======================================================
   UPLOAD BUSINESS MENU (PDF)
   POST /api/business/menu/upload?businessId=UUID
====================================================== */
export async function uploadBusinessMenu(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const user = await getUserFromSession(request, env);
  if (!user) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  /* =====================
     2️⃣ EXTRACT PARAM
  ====================== */
  const url = new URL(request.url);
  const businessId = url.searchParams.get("businessId");

  if (!businessId) {
    return json(
      { ok: false, error: "MISSING_BUSINESS_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD BUSINESS
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    BUSINESS_KEY(businessId)
  );

  if (!raw) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     4️⃣ VALIDATE DOMAIN
  ====================== */
  let business;
  try {
    business = BusinessSchema.parse(JSON.parse(raw));
  } catch {
    return json(
      { ok: false, error: "CORRUPTED_BUSINESS_DATA" },
      request,
      env,
      500
    );
  }

  /* =====================
     5️⃣ OWNERSHIP CHECK
  ====================== */
  if (business.ownerUserId !== user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     6️⃣ PARSE FORM DATA
  ====================== */
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(
      { ok: false, error: "INVALID_FORM_DATA" },
      request,
      env,
      400
    );
  }

  const file = form.get("file");

  if (!(file instanceof File)) {
    return json(
      { ok: false, error: "MISSING_PDF_FILE" },
      request,
      env,
      400
    );
  }

  if (file.type !== "application/pdf") {
    return json(
      { ok: false, error: "ONLY_PDF_ALLOWED" },
      request,
      env,
      400
    );
  }

  /* =====================
     7️⃣ UPLOAD (DETERMINISTIC KEY)
  ====================== */
  const key = `menu-${businessId}.pdf`;

  await env.BUSINESS_MENU_BUCKET.put(
    key,
    file.stream(),
    {
      httpMetadata: {
        contentType: "application/pdf",
      },
    }
  );

  const menuPdfUrl = `${env.R2_PUBLIC_BASE_URL}/${key}`;

  /* =====================
     8️⃣ UPDATE BUSINESS
     (menu upload ⇒ pending)
  ====================== */
  const updatedBusiness = {
    ...business,
    menuPdfUrl,
    status: "pending",
  };

  await env.BUSINESS_KV.put(
    BUSINESS_KEY(businessId),
    JSON.stringify(updatedBusiness)
  );

  /* =====================
     9️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      businessId,
      menuPdfUrl,
      status: "pending",
    },
    request,
    env
  );
}
