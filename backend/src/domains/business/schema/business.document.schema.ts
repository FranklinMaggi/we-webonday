import { z } from "zod";

/* ======================================================
 * BUSINESS DOCUMENT (VERIFICA)
 * ====================================================== */
export const BusinessDocumentSchema = z.object({
  /* =========================
     TIPO
  ========================= */
  type: z.enum([
    "business_register",   // visura camerale
    "vat_certificate",     // certificato P.IVA
    "business_license",    // licenza / SCIA
    "other",
  ]),

  /* =========================
     FORMATO
  ========================= */
  format: z.enum(["pdf", "img"]),

  /* =========================
     STORAGE
  ========================= */
  objectKey: z.string(),           // R2 key (source of truth)
  publicUrl: z.string().url().optional(), // solo se pubblico

  checksum: z.string().optional(),
  size: z.number().int().positive().optional(),

  /* =========================
     VERIFICA
  ========================= */
  verificationStatus: z
    .enum(["pending", "approved", "rejected"])
    .default("pending"),

  verifiedAt: z.string().datetime().optional(),

  /* =========================
     AUDIT
  ========================= */
  uploadedAt: z.string().datetime(),
  uploadedByUserId: z.string().uuid(),
});

export type BusinessDocumentDTO =
  z.infer<typeof BusinessDocumentSchema>;
