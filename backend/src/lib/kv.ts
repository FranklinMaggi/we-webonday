/* =========================================================
   KV KEYS — SINGLE SOURCE OF TRUTH
   =========================================================
   Questo file definisce TUTTE le chiavi KV usate dal backend.
   - Nessuna logica
   - Nessun accesso a Env
   - Solo naming + responsabilità
========================================================= */

/* =========================================================
   INGREDIENTI (CATALOGO FOOD)
   KV: PRODUCTS_KV
========================================================= */

/**
 * Catalogo ingredienti globale (read-only)
 * tenantId = null
 */
export const INGREDIENT_GLOBAL_KEY = (ingredientId: string) =>
  `INGREDIENT:GLOBAL:${ingredientId}`;

/**
 * Override ingredienti per tenant (business)
 * prezzo / enabled
 */
export const INGREDIENT_TENANT_KEY = (
  tenantId: string,
  ingredientId: string
) =>
  `INGREDIENT:TENANT:${tenantId}:${ingredientId}`;


/* =========================================================
   FOOD PRODUCTS
   KV: PRODUCTS_KV
========================================================= */

/**
 * Template prodotto (es. pizza base)
 * creato dalla piattaforma
 */
export const FOOD_TEMPLATE_KEY = (templateId: string) =>
  `FOOD:TEMPLATE:${templateId}`;

/**
 * Prodotto creato / personalizzato dal business
 */
export const FOOD_PRODUCT_KEY = (
  tenantId: string,
  productId: string
) =>
  `FOOD:PRODUCT:${tenantId}:${productId}`;


/* =========================================================
   BUSINESS
   KV: BUSINESS_KV
========================================================= */

/**
 * Business principale (domain object)
 */
export const BUSINESS_KEY = (businessId: string) =>
  `BUSINESS:${businessId}`;

/**
 * Indice diretto user → business
 * lookup O(1)
 */
export const USER_BUSINESS_KEY = (userId: string) =>
  `USER:BUSINESS:${userId}`;


/* =========================================================
   REFERRALS
   KV: REFERRALS_KV  ✅ (già esistente)
========================================================= */

/**
 * Referral source of truth
 * code → referral object
 */
export const REFERRALS_KEY = (code: string) =>
  `REFERRAL:${code}`;

/**
 * Indice referral creati da un utente
 * dashboard user
 */
export const USER_REFERRALS_INDEX = (userId: string) =>
  `USER:REFERRALS:${userId}`;

/**
 * Referral riscattato da un business
 * join business ↔ referral
 */
export const BUSINESS_REFERRAL_KEY = (businessId: string) =>
  `BUSINESS:REFERRAL:${businessId}`;

/**
 * Indice admin per stato referral
 * used by admin dashboard
 */
export const REFERRAL_STATUS_INDEX = (
  status: "issued" | "redeemed" | "confirmed" | "expired"
) =>
  `REFERRAL:STATUS:${status}`;


/* =========================================================
   ORDERS
   KV: ORDER_KV
========================================================= */

export const ORDER_KEY = (orderId: string) =>
  `ORDER:${orderId}`;


/* =========================================================
   CART
   KV: CART_KV
========================================================= */

export const CART_KEY = (visitorId: string) =>
  `CART:${visitorId}`;


/* =========================================================
   ACTIVITY / AUDIT LOG
   KV: ON_ACTIVITY_USER_KV
========================================================= */

export const ACTIVITY_KEY = (activityId: string) =>
  `ACTIVITY:${activityId}`;


/* =========================================================
   POLICY
   KV: POLICY_KV
========================================================= */

export const POLICY_VERSION_KEY = (version: string) =>
  `POLICY_VERSION:${version}`;

export const POLICY_ACCEPTANCE_KEY = (
  userId: string,
  version: string
) =>
  `POLICY_ACCEPTANCE:${userId}:${version}`;
