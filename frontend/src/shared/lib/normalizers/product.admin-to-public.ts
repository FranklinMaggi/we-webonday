/**
 * ======================================================
 * FE || NORMALIZER — PRODUCT (ADMIN → PUBLIC)
 * ======================================================
 *
 * RUOLO:
 * - Adattare il dominio backend al modello UI pubblico
 *
 * NOTE:
 * - Punto UNICO di traduzione
 * - Nessuna fetch qui
 * ======================================================
 */

import type { AdminProductApiModel } from "../apiModels/admin/Product.api-model";
import type {
  ProductVM,
  ProductOptionVM,
} from "../viewModels/product/Product.view-model";

/* =========================
   OPTION NORMALIZER
========================= */
export function normalizeAdminOption(raw: any): ProductOptionVM {
  return {
    id: raw.id,

    // 👇 UI usa label, BE usa name
    label: raw.label ?? raw.name ?? "Opzione",

    // 👇 description passa SOLO se BE la espone
    description: raw.description ?? "",

    price: Number(raw.price) || 0,

    // 👇 NON hardcodare
    type:
      raw.type === "yearly"
        ? "yearly"
        : raw.type === "one_time"
        ? "one_time"
        : "monthly",
  };
}

/* =========================
   PRODUCT NORMALIZER
========================= */
export function normalizeAdminProductToPublic(
  raw: AdminProductApiModel & { options?: any[] }
): ProductVM {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? "",

    startupFee: Number(raw.startupFee) || 0,

    pricing: {
      yearly: Number(raw.pricing?.yearly) || 0,
      monthly: Number(raw.pricing?.monthly) || 0,
    },

    requiresConfiguration: Boolean(raw.requiresConfiguration),

    // 👇 QUI PASSA TUTTO
    options: raw.options?.map(normalizeAdminOption) ?? [],
  };
}
