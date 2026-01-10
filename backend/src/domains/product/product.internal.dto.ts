/* ======================================================
   AI-SUPERCOMMENT
   DOMAIN || PRODUCT || INTERNAL DTO
======================================================

RUOLO:
- DTO interno backend per Product
- Usato da routes e domain logic

ORIGINE:
- Allineato a ProductSchema
- Popolato tramite product.normalizer

NON È:
- NON un DTO pubblico
- NON un contratto frontend
====================================================== */

export interface ProductInternalDTO {
    id: string;
    name: string;
    description: string;
    nameKey?: string;
    descriptionKey?: string;
    startupFee: number;
    pricing: {
      yearly: number;
      monthly: number;
    };
    optionIds: string[];
    status: "DRAFT" | "ACTIVE" | "ARCHIVED";
    createdAt: string;
    updatedAt: string;
  }
  