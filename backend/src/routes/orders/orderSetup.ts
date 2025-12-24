import type { Env } from "../../types/env";
import { OrderSetupSchema } from "../../schemas/orders/orderSetupSchema";
import { json } from "../../lib/https";
export async function saveOrderSetup(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, request, env, 405);
  }

  const orderId = new URL(request.url).searchParams.get("orderId");
  if (!orderId) {
    return json({ ok: false, error: "MISSING_ORDER_ID" }, request, env, 400);
  }

  let body;
  try {
    body = OrderSetupSchema.parse(await request.json());
  } catch (err) {
    return json(
      { ok: false, error: "INVALID_SETUP_DATA", details: err },
      request,
      env,
      400
    );
  }

  await env.ORDER_KV.put(
    `ORDER_SETUP:${orderId}`,
    JSON.stringify({
      ...body,
      updatedAt: new Date().toISOString(),
    })
  );

  return json({ ok: true }, request, env);
}
