/* =========================================================
   KV KEYS — SINGLE SOURCE OF TRUTH
   =========================================================
   Questo file definisce TUTTE le chiavi KV usate dal backend.
   - Nessuna logica
   - Nessun accesso a Env
   - Solo naming + responsabilità
========================================================= */
// ============================================================
// AI-SUPERCOMMENT
// KV KEYS — SINGLE SOURCE OF TRUTH
//
// PRODUCT_KEY(id)
// OPTIONS_KEY(id)
//
// PERCHE:
// - Nessun parsing manuale di stringhe
// - Evita collisioni cross-domain
// ============================================================
export const OPTIONS_KEY = (optionId: string) =>
  `OPTION:${optionId}`;
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
  `USER:REFERRAL:${userId}`;

/**
 * Referral riscattato da un business
 * join business ↔ referral
 */
export const BUSINESS_REFERRALS_KEY = (businessId: string) =>
  `BUSINESS:REFERRAL:${businessId}`;

/**
 * Indice admin per stato referral
 * used by admin dashboard
 */
export const REFERRALS_STATUS_INDEX = (
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

  /* =========================================================
   PROJECTS
   KV: PROJECTS_KV
========================================================= */

/**
 * Project = esecuzione ONE-TIME (ProjectSchema)
 *
 * Scelta chiave:
 * - Deve permettere LIST per business (dashboard/admin)
 * - Deve evitare indici duplicati
 *
 * Pattern:
 * - key canonica include businessId come prefisso:
 *   PROJECT:{businessId}:{projectKey}
 *
 * Così puoi:
 * - list per business: prefix PROJECT:{businessId}:
 * - get singolo: PROJECT_KEY(businessId, projectKey)
 */
export const PROJECTS_KEY = (businessId: string, projectKey: string) =>
  `PROJECT:${businessId}:${projectKey}`;

export const PROJECTS_BY_BUSINESS_PREFIX = (businessId: string) =>
  `PROJECT:${businessId}:`;
