// backend/src/routes/referral.ts
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
import type { Env } from "../../types/env";

import {
  REFERRALS_KEY,
  USER_REFERRALS_INDEX,
} from "../../lib/kv";

import { createReferral } from "../../lib/referral/referralDomain";
import { requireUser } from "../../lib/auth/session";
import { json } from "../../lib/https";

/* ======================================================
   CREATE REFERRAL
   POST /api/referral/create
====================================================== */
export async function createReferralHandler(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireUser(request, env);

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
     2️⃣ CHECK EXISTING REFERRAL
     (1 referral per user)
  ====================== */
  const existingCode = await env.REFERRALS_KV.get(
    USER_REFERRALS_INDEX(user.id)
  );

  if (existingCode) {
    return json(
      {
        ok: true,
        referralCode: existingCode,
        alreadyExists: true,
      },
      request,
      env
    );
  }

  /* =====================
     3️⃣ CREATE REFERRAL
  ====================== */
  const code = `TOK_SHOP_${crypto
    .randomUUID()
    .slice(0, 8)}`;

  const referral = createReferral(user.id, code);

  /* =====================
     4️⃣ PERSIST
  ====================== */
  await env.REFERRALS_KV.put(
    REFERRALS_KEY(code),
    JSON.stringify(referral)
  );

  await env.REFERRALS_KV.put(
    USER_REFERRALS_INDEX(user.id),
    code
  );

  /* =====================
     5️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      referralCode: code,
    },
    request,
    env
  );
}

/* ======================================================
   GET MY REFERRAL
   GET /api/referral/mine
====================================================== */
export async function getMyReferral(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireUser(request, env);

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
     2️⃣ LOOKUP USER → REFERRAL
  ====================== */
  const code = await env.REFERRALS_KV.get(
    USER_REFERRALS_INDEX(user.id)
  );

  if (!code) {
    return json(
      { ok: true, referral: null },
      request,
      env
    );
  }

  /* =====================
     3️⃣ LOAD REFERRAL
  ====================== */
  const raw = await env.REFERRALS_KV.get(
    REFERRALS_KEY(code)
  );

  if (!raw) {
    // indice rotto o referral cancellato
    return json(
      { ok: true, referral: null },
      request,
      env
    );
  }

  /* =====================
     4️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      referral: JSON.parse(raw),
    },
    request,
    env
  );
}
