// ======================================================
// ADMIN DOCUMENT TYPES — SOURCE OF TRUTH
// ======================================================

/* =====================
   OWNER DOCUMENTS
===================== */
export const OWNER_DOCUMENT_TYPES = [
    "front",
    "back",
  ] as const;
  
  export type OwnerDocumentType =
    typeof OWNER_DOCUMENT_TYPES[number];
  
  export function isOwnerDocumentType(
    v: string
  ): v is OwnerDocumentType {
    return OWNER_DOCUMENT_TYPES.includes(
      v as OwnerDocumentType
    );
  }
  
  /* =====================
     BUSINESS DOCUMENTS
  ===================== */
  export const BUSINESS_DOCUMENT_TYPES = [
    "certificate", // visura camerale
  ] as const;
  
  export type BusinessDocumentType =
    typeof BUSINESS_DOCUMENT_TYPES[number];
  
  export function isBusinessDocumentType(
    v: string
  ): v is BusinessDocumentType {
    return BUSINESS_DOCUMENT_TYPES.includes(
      v as BusinessDocumentType
    );
  }