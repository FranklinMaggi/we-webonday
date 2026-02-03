import { z } from "zod";

/**
 * OwnerSingleDocumentSchema
 *
 * RUOLO:
 * - Metadati di UN documento caricato dall’utente
 * - NON contiene File (solo riferimento storage)
 */
export const OwnerSingleDocumentSchema = z.object({
  /* =========================
     TIPO LOGICO
  ========================= */
  type: z.enum([
    "identity_card_front",
    "identity_card_back",
  ]),

  /* =========================
     FORMATO
  ========================= */
  format: z.literal("img"),

  /* =========================
     STORAGE
  ========================= */
  url: z.string().url(),
  size: z.number().int().positive(),

  /* =========================
     STATO VERIFICA
  ========================= */
  verificationStatus: z
    .enum(["pending", "approved", "rejected"])
    .default("pending"),

  /* =========================
     AUDIT
  ========================= */
  uploadedAt: z.string().datetime(),
});

/**
 * OwnerDocumentsSchema
 *
 * RUOLO:
 * - Collezione documenti Owner
 * - Legata alla CONFIGURATION
 * - STEP PRE-VERIFICA
 */
export const OwnerDocumentsSchema = z.object({
  front: OwnerSingleDocumentSchema.optional(),
  back: OwnerSingleDocumentSchema.optional(),
});
