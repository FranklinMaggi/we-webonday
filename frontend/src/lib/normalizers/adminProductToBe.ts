// ======================================================
// FE || lib/normalizers/adminProductToBE.ts
// ======================================================
// ADAPTER ADMIN FE → BACKEND CORE
//
// NOTA:
// - Le opzioni NON transitano più da qui
// - Questo normalizer gestisce SOLO dati prodotto
// ======================================================

import type { AdminProductDTO } from "../dto/AdminProductDTO";
import type { AdminUpdateProductDTO } from "../dto/AdminUpdateProductDTO";

export function adminProductToBE(
  product: AdminProductDTO
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
