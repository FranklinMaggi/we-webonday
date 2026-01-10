/* ======================================================
   AI-SUPERCOMMENT
   DOMAIN || BUSINESS || PUBLIC DTO
======================================================

RUOLO:
- Contratto API pubblico per Business
- Usato da:
  - /api/business/public/*
  - frontend (read-only)

CONTENUTO:
- Solo campi sicuri
- Nessuna informazione sensibile

INVARIANTI:
- Non contiene ownerUserId
- Non contiene referralToken
- Non contiene stato interno avanzato

MODIFICHE:
- Ogni modifica richiede audit FE
====================================================== */


export interface BusinessPublicDTO {
  id: string;
  name: string;
  address: string;
  phone: string;
  openingHours?: string | null;
  menuPdfUrl: string | null;
}
