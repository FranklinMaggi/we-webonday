// ======================================================
// FE || DTO || BusinessReadDTO (CANONICAL)
// ======================================================
//
// SOURCE OF TRUTH:
// - BusinessSchema (BE)
//
// NOTE:
// - DTO FE → NON espone campi interni BE
// - NO draft
// - NO logica wizard
// ======================================================

import type { OpeningHoursFE } from
  "@shared/domain/business/openingHours.types";

/* =========================
   MEDIA DTO
========================= */

export type BusinessMediaDTO = {
  objectKey: string;
  url: string;
  uploadedAt: string;
};

export type BusinessGalleryImageDTO = {
  objectKey: string;
  url: string;
  order: number;
  uploadedAt: string;
};

export type BusinessDocumentDTO = {
  type:
    | "business_register"
    | "vat_certificate"
    | "business_license"
    | "other";

  format: "pdf" | "img";

  objectKey: string;
  publicUrl?: string;

  verificationStatus:
    | "pending"
    | "approved"
    | "rejected";

  uploadedAt: string;
  uploadedByUserId: string;

  verifiedAt?: string;
};

/* =========================
   MAIN DTO
========================= */

export type BusinessReadDTO = {
  /* =====================
     IDENTITY
  ====================== */
  id: string;                 // = configurationId
  configurationId: string;

  ownerUserId: string;

  publicId: string;

  /* =====================
     COMMERCIAL (IMMUTABLE)
  ====================== */
  solutionId: string;
  productId: string;

  /* =====================
     CORE BUSINESS
  ====================== */
  businessName: string;

  openingHours: OpeningHoursFE;

  contact: {
    mail: string;
    phoneNumber?: string;
    pec?: string;
  };

  address?: {
    street?: string;
    number?: string;
    city?: string;
    province?: string;
    region?: string;
    zip?: string;
    country?: string;
  };

  classification: {
    descriptionTags: string[];
    serviceTags: string[];
  };

  /* =====================
     MEDIA
  ====================== */
  logo: BusinessMediaDTO | null;
  coverImage: BusinessMediaDTO | null;
  gallery: BusinessGalleryImageDTO[];

  /* =====================
     LEGAL
  ====================== */
  documents: BusinessDocumentDTO[];

  /* =====================
     STATE
  ====================== */
  businessDescriptionText:string, 
  businessDescriptionTags: string[];
  businessServiceTags: string[];
  verification: "DRAFT"|"PENDING" | "ACCEPTED" | "REJECTED";      
 
  businessDataComplete: boolean;
  verifiedAt?: string;

  /* =====================
     AUDIT
  ====================== */
  createdAt: string;
  updatedAt: string;
};

export type SolutionSeed = {
  descriptionTags: string[];
  serviceTags: string[];
  openingHours: OpeningHoursFE | null;
};
