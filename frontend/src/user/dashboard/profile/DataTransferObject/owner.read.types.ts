// ======================================================
// FE || OWNER || READ DTO (CONTRACT)
// ======================================================
//
// SOURCE:
// - BE: /domains/owner/DataTransferObject/output/owner-read.dto.ts
//
// NOTA:
// - DTO duplicato volontariamente
// - NON importare dal BE
//
// ======================================================

export type OwnerVerification =
  | "DRAFT"
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED";

export type OwnerContactDTO = {
  mail?: string;
  phoneNumber?: string;
};

export type OwnerAddressDTO = {
  street?: string;
  number?: string;
  province?: string;
  region?: string;
  city?: string;
  zip?: string;
  country?: string;
};

export type OwnerReadDTO = {
  id: string;
  userId: string;

  firstName: string;
  lastName: string;
  birthDate?: string;

  contact?: OwnerContactDTO;
  address?: OwnerAddressDTO;

  source?: "google" | "manual";
  verification: OwnerVerification;
};
