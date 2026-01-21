// backend/src/routes/businessSubmit.ts
/* =====================
   1️⃣ AUTH GUARD (HARD)
======================

AI-SUPERCOMMENT — AUTH INVARIANT

RUOLO:
- Questo endpoint richiede utente autenticato
- La sessione è l’unica fonte di verità

INVARIANTI:
- Se sessione mancante o invalida → 401
- NON usare getUserFromSession come guard

PERCHÉ:
- Evita sessioni fantasma
- Allinea BE e FE
====================== */

import type { Env } from "../../../../types/env";

import { BusinessSchema } from "../../schema/business.schema";
import { logActivity } from "../../../activity/router/logActivity";

import { BUSINESS_KEY } from "../../../../lib/kv";
import { requireAuthUser } from "@domains/auth";
import { json } from "../../../auth/route/helper/https";

/* ======================================================
   SUBMIT BUSINESS
   POST /api/business/submit
   Transizione: draft → pending
====================================================== */
export async function submitBusiness(
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
  
  const user = session.user;

  /* =====================
     2️⃣ LOOKUP USER → BUSINESS
  ====================== */
  const businessId = await env.BUSINESS_KV.get(
    `USER_BUSINESS:${user.id}`
  );

  if (!businessId) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

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
     3️⃣ VALIDATE DOMAIN
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
     4️⃣ OWNERSHIP CHECK
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
     5️⃣ STATE GUARDS
  ====================== */
  if (business.status === "pending") {
    return json(
      {
        ok: true,
        businessId,
        status: "pending",
        alreadySubmitted: true,
      },
      request,
      env
    );
  }

  if (business.status !== "draft") {
    return json(
      {
        ok: false,
        error: "INVALID_BUSINESS_STATE",
        currentStatus: business.status,
      },
      request,
      env,
      409
    );
  }

  /* =====================
     6️⃣ STATE TRANSITION
  ====================== */
  const updatedBusiness = {
    ...business,
    status: "pending" as const,
  };

  await env.BUSINESS_KV.put(
    BUSINESS_KEY(businessId),
    JSON.stringify(updatedBusiness)
  );

  /* =====================
     7️⃣ AUDIT LOG
  ====================== */
  await logActivity(env, "BUSINESS_SUBMITTED", user.id, {
    businessId,
    name: business.name,
    submittedAt: new Date().toISOString(),
  });

  /* =====================
     8️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      businessId,
      status: "pending",
    },
    request,
    env
  );
}
