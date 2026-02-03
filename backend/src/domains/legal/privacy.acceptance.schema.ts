import { z } from "zod";

export const PrivacyAcceptanceSchema = z.object({
  accepted: z.literal(true),
  acceptedAt: z.string().min(1),
  policyVersion: z.string().min(1),

  // chi ha accettato
  subject: z.enum(["business", "owner"]),

  // opzionale: da dove
  source: z.enum(["business-form", "owner-form"]).optional(),
});

export type PrivacyAcceptanceDTO = z.infer<
  typeof PrivacyAcceptanceSchema
>;