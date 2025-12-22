import type { Env } from "../types/env";
import { BusinessSchema } from "../schemas/business/businessSchema";
import {
  BUSINESS_KEY,
  BUSINESS_INDEX_KEY,
  REFERRAL_KEY,
} from "../lib/kv";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* ===========================================
   CREATE BUSINESS
   POST /api/business/create
   =========================================== */
export async function createBusiness(request: Request, env: Env) {
  let body: any;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const {
    ownerUserId,
    name,
    address,
    phone,
    openingHours,
    referredBy,
  } = body;

  if (!ownerUserId || !name || !address || !phone) {
    return json({ error: "Missing required fields" }, 400);
  }
  // verifica se l’utente ha già un business
const existing = await env.BUSINESS_KV.list({
    prefix: "BUSINESS:",
  });
  
  for (const k of existing.keys) {
    const raw = await env.BUSINESS_KV.get(k.name);
    if (!raw) continue;
    const b = JSON.parse(raw);
    if (b.ownerUserId === ownerUserId) {
      return json(
        { error: "User already owns a business" },
        409
      );
    }
  }
  
  const id = crypto.randomUUID();
  const referralToken = crypto.randomUUID().slice(0, 8);

  const rawBusiness = {
    id,
    ownerUserId,
    name,
    address,
    phone,
    openingHours: openingHours ?? null,
    menuPdfUrl: null,
    referralToken,
    referredBy: referredBy ?? null,
    status: "draft",
    createdAt: new Date().toISOString(),
  };

  let business;
  try {
    business = BusinessSchema.parse(rawBusiness);
  } catch (err) {
    return json({ error: "Business validation failed", details: err }, 400);
  }

  // salva business
  await env.BUSINESS_KV.put(
    BUSINESS_KEY(id),
    JSON.stringify(business)
  );

  // aggiorna indice
  const indexRaw = await env.BUSINESS_KV.get(BUSINESS_INDEX_KEY);
  const index = indexRaw ? JSON.parse(indexRaw) : [];
  index.push(id);

  await env.BUSINESS_KV.put(
    BUSINESS_INDEX_KEY,
    JSON.stringify(index)
  );

  // salva referral
  await env.REFERRAL_KV.put(
    REFERRAL_KEY(referralToken),
    id
  );

  return json({ ok: true, business });
}

/* ===========================================
   GET BUSINESS
   GET /api/business/:id
   =========================================== */
export async function getBusiness(request: Request, env: Env) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) return json({ error: "Missing businessId" }, 400);

  const raw = await env.BUSINESS_KV.get(BUSINESS_KEY(id));
  if (!raw) return json({ error: "Business not found" }, 404);

  return json({ ok: true, business: JSON.parse(raw) });
}
