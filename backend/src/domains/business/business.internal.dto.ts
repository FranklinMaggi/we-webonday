/* ======================================================
   AI-SUPERCOMMENT
   DOMAIN || BUSINESS || INTERNAL DTO
======================================================

RUOLO:
- DTO interno del backend
- Forma dati sicura usata da:
  - routes
  - domain logic
  - serializzazione KV

ORIGINE:
- Derivato da BusinessSchema
- Popolato tramite business.normalizer

NON È:
- NON un DTO pubblico
- NON un input HTTP
- NON un contratto FE

REGOLE:
- Deve restare allineato a BusinessSchema
- Può includere campi non esposti al FE
====================================================== */


export interface BusinessInternalDTO {
  id: string;
  publicId: string;
  ownerUserId: string;

  name: string;
  address: string;
  phone: string;

  openingHours?: string | null;

  // ORIGINE COMMERCIALE
  solutionId: string;
  productId: string;
  optionIds: string[];

  // MEDIA
  logoUrl: string | null;
  coverImageUrl: string | null;
  galleryImageUrls: string[];

  // DESIGN PROFILE
  designProfile?: {
    category?: string;
    tone?: string;
  };

  // REFERRAL
  referralToken: string;
  referredBy: string | null;

  status: "draft" | "pending" | "active" | "suspended";
  createdAt: string;
}
