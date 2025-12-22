/* ========= INGREDIENTI ========= */

// Catalogo globale (read-only)
export const INGREDIENT_GLOBAL_KEY = (id: string) =>
    `INGREDIENT:GLOBAL:${id}`;
  
  // Override tenant (price, enabled)
  export const INGREDIENT_TENANT_KEY = (tenantId: string, ingredientId: string) =>
    `INGREDIENT:TENANT:${tenantId}:${ingredientId}`;
  
  
  /* ========= FOOD ========= */
  
  // Template prodotto (pizza base, ecc.)
  export const FOOD_TEMPLATE_KEY = (id: string) =>
    `FOOD:TEMPLATE:${id}`;
  
  // Menu prodotto creato dal tenant
  export const FOOD_PRODUCT_KEY = (tenantId: string, productId: string) =>
    `FOOD:PRODUCT:${tenantId}:${productId}`;
  
  /* ========= BUSINESS ========= */

export const BUSINESS_KEY = (id: string) =>
  `BUSINESS:${id}`;

export const BUSINESS_INDEX_KEY = `BUSINESS:INDEX`;

/* ========= REFERRAL ========= */

export const REFERRAL_KEY = (token: string) =>
  `REFERRAL:${token}`;