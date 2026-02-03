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
  verification: z.enum([
   "PENDING",
   "ACCEPTED",
   "REJECTED",
 ]).default("PENDING"),

  verifiedAt: z.string().datetime().optional(),
});
