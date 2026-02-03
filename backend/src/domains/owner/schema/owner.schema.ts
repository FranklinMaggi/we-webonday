import { z } from "zod";
import { OwnerDraftSchema } from "./owner.draft.schema";
import { OwnerDocumentsSchema } from "./owner.document.schema";

/* ======================================================
 * OWNER — FINAL ENTITY
 * ====================================================== */
export const OwnerSchema = OwnerDraftSchema.extend({
  /* =========================
     IDENTITÀ (RAFFORZATA)
  ========================= */
  id: z.string().uuid(),
  userId: z.string().uuid(),

  /* =========================
     DOCUMENTI LEGALI
  ========================= */
  documents: z.array(OwnerDocumentsSchema).default([]),

  /* =========================
     STATO REALE
  ========================= */
  status: z.enum([
    "pending",     // draft completo ma non verificato
    "verified",    // documenti approvati
    "rejected",    // verifica fallita
    "suspended",
  ]),

  verifiedAt: z.string().datetime().optional(),
});
