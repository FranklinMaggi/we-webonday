import type { Env } from "../../../../../types/env";
import { TenantIngredientOverrideSchema } from "../../../../food/business.food.menu.schema";
import { INGREDIENT_TENANT_KEY } from "../../../../../lib/kv";

/* GET override ingredienti tenant */
export async function getFoodIngredientOverrides(
  request: Request,
  env: Env
) {
  const tenantId = new URL(request.url).searchParams.get("tenantId");
  if (!tenantId) throw new Error("Missing tenantId");

  const list = await env.PRODUCTS_KV.list({
    prefix: `INGREDIENT:TENANT:${tenantId}:`,
  });

  const overrides = [];
  for (const k of list.keys) {
    const raw = await env.PRODUCTS_KV.get(k.name);
    if (raw) overrides.push(JSON.parse(raw));
  }

  return overrides;
}

/* PUT override singolo */
export async function setFoodIngredientOverride(
  request: Request,
  env: Env
) {
  const tenantId = new URL(request.url).searchParams.get("tenantId");
  if (!tenantId) throw new Error("Missing tenantId");
  
  const body = TenantIngredientOverrideSchema.parse(await request.json());
  
  const key = INGREDIENT_TENANT_KEY(tenantId, body.ingredientId);

  await env.PRODUCTS_KV.put(key, JSON.stringify(body));

  return { ok: true };
}
