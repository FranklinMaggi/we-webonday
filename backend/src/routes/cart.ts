import type { Env } from "../types/env";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

/* ============================================================
   GUEST CART (ANONIMO) — FUNZIONA COME LA TUA VERSIONE VECCHIA
============================================================ */

export async function createCart(request: Request, env: Env) {
  const body = await request.json();
  const id = crypto.randomUUID();

  await env.CART_KV.put(`CART:${id}`, JSON.stringify({
    cartId: id,
    items: body,
    createdAt: new Date().toISOString(),
  }));

  return json({ ok: true, cartId: id });
}

export async function getCart(request: Request, env: Env) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "Missing id" }, 400);

  const stored = await env.CART_KV.get(`CART:${id}`);
  if (!stored) return json({ error: "Not found" }, 404);

  return json(JSON.parse(stored));
}

export async function updateCart(request: Request, env: Env) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "Missing id" }, 400);

  const items = await request.json();
  
  await env.CART_KV.put(`CART:${id}`, JSON.stringify({
    cartId: id,
    items,
    updatedAt: new Date().toISOString(),
  }));

  return json({ ok: true, id, items });
}

/* ============================================================
   USER CART — CARRELLO ASSOCIATO A USERID (NUOVO)
============================================================ */

export async function saveUserCart(request: Request, env: Env) {
  const body = await request.json() as {
    userId: string;
    items: any[];
  };

  if (!body.userId)
    return json({ error: "Missing userId" }, 400);

  await env.CART_KV.put(`USER_CART:${body.userId}`, JSON.stringify({
    userId: body.userId,
    items: body.items,
    updatedAt: new Date().toISOString(),
  }));

  return json({ ok: true });
}

export async function getUserCart(request: Request, env: Env) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId)
    return json({ error: "Missing userId" }, 400);

  const stored = await env.CART_KV.get(`USER_CART:${userId}`);
  if (!stored)
    return json({ items: [] }); // utente nuovo = nessun carrello ancora

  return json(JSON.parse(stored));
}
