/* ======================================================
   AI-SUPERCOMMENT
   DOMAIN || BUSINESS || STORAGE NORMALIZER
======================================================

RUOLO:
- Adatta dati raw (KV / storage) al DTO interno

USATO DA:
- routes read
- services
- mapping verso DTO pubblici

REGOLE:
- Nessuna validazione
- Nessuna mutazione di stato
- Nessuna logica di business

INPUT:
- raw (unknown / any)

OUTPUT:
- BusinessInternalDTO
====================================================== */


import type { BusinessInternalDTO } from "./business.internal.dto";

export function normalizeBusiness(raw: any): BusinessInternalDTO {
  return {
    id: raw.id,
    publicId: raw.publicId,
    ownerUserId: raw.ownerUserId,

    name: raw.name,
    address: raw.address,
    phone: raw.phone,

    openingHours: raw.openingHours ?? null,

    solutionId: raw.solutionId,
    productId: raw.productId,
    optionIds: Array.isArray(raw.optionIds) ? raw.optionIds : [],

    logoUrl: raw.logoUrl ?? null,
    coverImageUrl: raw.coverImageUrl ?? null,
    galleryImageUrls: Array.isArray(raw.galleryImageUrls)
      ? raw.galleryImageUrls
      : [],

    designProfile: raw.designProfile ?? undefined,
    descriptionTags: Array.isArray(raw.descriptionTags)
  ? raw.descriptionTags
  : [],

serviceTags: Array.isArray(raw.serviceTags)
  ? raw.serviceTags
  : [],

    referralToken: raw.referralToken,
    referredBy: raw.referredBy ?? null,

    status: raw.status,
    createdAt: raw.createdAt,
  };
}
