import type { Env } from "../types/env";
import {
  REFERRALS_KEY,
  USER_REFERRALS_INDEX,
} from "../lib/kv";
import { createReferral } from "../lib/referral/referralDomain";
import { requireUser } from "../lib/auth";
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * POST /api/referral/create
 */
export async function createReferralHandler(
    request: Request,
    env: Env
  ) {
    // 1️⃣ AUTH
    const auth = await requireUser(request, env);
    if (!auth) {
      return json({ error: "Unauthorized" }, 401);
    }
  
    const { userId } = auth;
  
    // 2️⃣ Codice referral (per ora random, poi deterministico se vuoi)
    const code = `TOK_SHOP_${crypto.randomUUID().slice(0, 8)}`;
  
    const referral = createReferral(userId, code);
  
    // 3️⃣ Persist referral
    await env.REFERRALS_KV.put(
      REFERRALS_KEY(code),
      JSON.stringify(referral)
    );
  
    // 4️⃣ Indice user → referral
    await env.REFERRALS_KV.put(
      USER_REFERRALS_INDEX(userId),
      code
    );
  
    return json({
      ok: true,
      referralCode: code,
    });
  }
  
/**
 * GET /api/referral/mine
 */
export async function getMyReferral(
    request: Request,
    env: Env
  ) {
    // 1️⃣ AUTH
    const auth = await requireUser(request, env);
    if (!auth) {
      return json({ error: "Unauthorized" }, 401);
    }
  
    const { userId } = auth;
  
    // 2️⃣ Lookup referral code dell’utente
    const code = await env.REFERRALS_KV.get(
      USER_REFERRALS_INDEX(userId)
    );
  
    if (!code) {
      return json({ ok: true, referral: null });
    }
  
    // 3️⃣ Load referral
    const raw = await env.REFERRALS_KV.get(
      REFERRALS_KEY(code)
    );
  
    if (!raw) {
      return json({ ok: true, referral: null });
    }
  
    return json({
      ok: true,
      referral: JSON.parse(raw),
    });
  }
  