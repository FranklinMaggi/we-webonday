
/* ======================================================
   AI-SUPERCOMMENT
   DOMAIN || REFERRAL || SCHEMA
======================================================

RUOLO:
- Source of Truth del dominio Referral
- Valida la struttura dei referral persistiti

CONTENUTO:
- Identità referral
- Stato lifecycle
- Relazione con business invitati

INVARIANTI:
- code è l’identificativo univoco
- ownerUserId identifica il creatore
- invitedBusinessIds è append-only
- status segue lifecycle controllato dal dominio

NON DEVE:
- NON contenere logica di business
- NON creare o modificare referral
- NON conoscere regole di reward

USATO DA:
- Persistence (KV)
- logiche di lettura admin/user
- Adapter di validazione

IMPATTO MODIFICHE:
- Cambiare questo schema richiede audit:
  - referral.domain.ts
  - routes/admin/referral
====================================================== */
import { z } from "zod";

export const ReferralDomainSchema = z.object({
  code: z.string(),
  ownerUserId: z.string(),
  createdAt: z.string(),
  status: z.enum(["issued","redeemed","confirmed","expired"]),
  invitedBusinessIds: z.array(z.string()),
});

export type ReferralDTO = z.infer<typeof ReferralDomainSchema>;
