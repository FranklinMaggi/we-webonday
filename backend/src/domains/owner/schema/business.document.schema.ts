import { z } from "zod";

export const BusinessDocumentSchema = z.object({
  type: z.literal("business_certificate"),
  format: z.enum(["pdf", "img"]),
  url: z.string().url(),
  size: z.number().int().positive(),

  verificationStatus: z
    .enum(["pending", "approved", "rejected"])
    .default("pending"),

  uploadedAt: z.string().datetime(),
});

export const BusinessDocumentsKVSchema = z.object({
  certificate: BusinessDocumentSchema.optional(),
});
