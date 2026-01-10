// ======================================================
// FE || lib/normalizers/mapamdinProductToUpdatePayload.ts
// ======================================================
// ADAPTER ADMIN FE → BACKEND CORE
//
// NOTA:
// - Le opzioni NON transitano più da qui
// - Questo normalizer gestisce SOLO dati prodotto
// ======================================================

import type { AdminProductApiModel } from "../apiModels/admin/Product.api-model";
import type { AdminUpdateProductDTO } from "../dto/AdminProductUpdatePayload";

export function adminProductToBE(
  product: AdminProductApiModel
): AdminUpdateProductDTO {
  return {
    id: product.id,
    name: product.name ?? "",
    description: product.description ?? "",
    status: product.status,

    startupFee: Number(product.startupFee) || 0,

    pricing: {
      yearly: Number(product.pricing?.yearly) || 0,
      monthly: Number(product.pricing?.monthly) || 0,
    },

 
   
  };
}
