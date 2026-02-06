// ======================================================
// BE || OWNER || READ ME (CANONICAL)
// ENDPOINT: GET /api/owner/me
// ======================================================

import type { Env } from "types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

import { OWNER_KEY } from "@domains/owner/keys";
import { OwnerSchema } from "../schema/owner.schema";

import type { OwnerReadDTO } from
  "../DataTransferObject/output/owner-read.dto";

export async function readOwnerMe(
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

  /* =====================
     2️⃣ LOAD OWNER (USER-SCOPED)
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    OWNER_KEY(session.user.id),
    "json"
  );

  if (!raw) {
    return json(
      { ok: true, owner: null },
      request,
      env
    );
  }

  /* =====================
     3️⃣ VALIDATE + MAP (DOMAIN SAFE)
  ====================== */
  const parsed = OwnerSchema.parse(raw);

  const owner: OwnerReadDTO = {
    id: parsed.id,
    userId: parsed.userId,

    firstName: parsed.firstName ?? "",
    lastName: parsed.lastName ?? "",
    birthDate: parsed.birthDate,

    contact: parsed.contact,
    address: parsed.address,

    source: parsed.source,
    verification: parsed.verification,
  };

  /* =====================
     4️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true, owner },
    request,
    env
  );
}
