// ======================================================
// BE || OWNER || UPSERT
// POST /api/owner
// ======================================================
//
// RUOLO:
// - Crea o aggiorna l’anagrafica Owner (user-scoped)
//
// INVARIANTI:
// - Owner è SEMPRE user-scoped
// - Nessun riferimento a Configuration
// - Nessuna verifica qui
// - Idempotente
//
// ======================================================
import type { Env } from "../../../types/env";
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import { OWNER_KEY } from "../keys";
import { OwnerSchema } from "../schema/owner.schema";
import type { OwnerInputDTO } from
  "../DataTransferObject/input/owner.input.dto";
import { isOwnerDataComplete } from "../service/owner.dataComplete";



export async function upsertOwner(
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
     2️⃣ INPUT
  ====================== */
  const input = (await request.json()) as OwnerInputDTO;

  /* =====================
     3️⃣ LOAD EXISTING OWNER (SE ESISTE)
  ====================== */
  const key = OWNER_KEY(userId);
 
  const existingRaw = await env.BUSINESS_KV.get(key, "json");

  const existing = existingRaw
  ? OwnerSchema.parse(existingRaw)
  : null;

  const ownerDataComplete = isOwnerDataComplete({
    input,
    existing,
  });
  const now = new Date().toISOString();

  {/** =====================
     4️⃣ BUILD OWNER (UPSERT)
  ====================== DEPRECATO CAUSAVA DUPLICAZIONE SECONDO 5.2 DI CHAT GPT 
  const ownerData = {
    firstName: input.firstName ?? existing?.firstName,
    lastName: input.lastName ?? existing?.lastName,
    birthDate: input.birthDate ?? existing?.birthDate,
  
    address: {
      ...existing?.address,
      ...input.address,
    },
  
    contact: {
      ...existing?.contact,
      ...input.contact,
    },
  
    ownerDataComplete,
  };
  */}
 
  const owner = OwnerSchema.parse({
    id: userId,
    userId,
  
    firstName: input.firstName ?? existing?.firstName,
    lastName: input.lastName ?? existing?.lastName,
    birthDate: input.birthDate ?? existing?.birthDate,
  
    address: {
      ...existing?.address,
      ...input.address,
    },
  
    contact: {
      ...existing?.contact,
      ...input.contact,
    },
  
    source: input.source ?? existing?.source,
  
    documents: existing?.documents ?? {
      front: undefined,
      back: undefined,
    },
  
    verification: existing?.verification ?? "DRAFT",
    verifiedAt: existing?.verifiedAt,
    ownerDataComplete,   // check with ownerDataComplete
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
  

  /* =====================
     5️⃣ PERSIST
  ====================== */
  await env.BUSINESS_KV.put(
    key,
    JSON.stringify(owner),
    {
      metadata: {
        type: "owner",
        userId,
      },
    }
  );

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true },
    request,
    env
  );
}
