import { z } from "zod";
import { BusinessDraftSchema } from "./business.draft.schema";
import { BusinessDocumentSchema } from "./business.document.schema";
import { LogoSchema } from "./logo.schema";
import { GalleryImageSchema } from "./gallery.schema";

/* ======================================================
 * BUSINESS (FINAL ENTITY)
 * ====================================================== */
export const BusinessSchema = BusinessDraftSchema.extend({
  /* =========================
     IDENTITY (FINAL)
  ========================= */
  id: z.string().uuid(),            // rafforzato
  publicId: z.string().min(3),

  ownerUserId: z.string().uuid(),
  createdByUserId: z.string().uuid(),

  editorUserIds: z.array(z.string().uuid()).default([]),

  /* =========================
     DOCUMENTI LEGALI
  ========================= */
  documents: z.array(BusinessDocumentSchema).default([]),

  /* =========================
     MEDIA
  ========================= */
  logo: LogoSchema.nullable(),
  coverImage: GalleryImageSchema.nullable(),
  gallery: z.array(GalleryImageSchema).max(12).default([]),

  /* =========================
     STATUS (REALE)
  ========================= */
  status: z.enum([
    "pending",     // creato ma non verificato
    "verified",    // documenti approvati
    "active",      // operativo
    "suspended",
  ]),

  verifiedAt: z.string().datetime().optional(),
});
