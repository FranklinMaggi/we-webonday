//ADMIN BACKEND ORDERB MANAGER
import type { Env } from "../types/env";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export async function listOrders(request: Request, env: Env) {
  const list = await env.ORDER_KV.list({ prefix: "ORDER:" });

  const orders = [];

  for (const key of list.keys) {
    const stored = await env.ORDER_KV.get(key.name);
    if (stored) orders.push(JSON.parse(stored));
  }

  // Ordina per data discendente
  orders.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return json({ ok: true, orders });
}
export async function getOrder(request: Request, env: Env) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
  
    if (!id) return json({ error: "Missing id" }, 400);
  
    const stored = await env.ORDER_KV.get(`ORDER:${id}`);
    if (!stored) return json({ error: "Not found" }, 404);
  
    return json({ ok: true, order: JSON.parse(stored) });
  }