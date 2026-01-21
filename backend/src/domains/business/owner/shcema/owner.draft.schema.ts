import {z} from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";

export const OwnerDraftSchema = z.object({
  id: z.string().uuid().min(1),
  userId: z.string().uuid().optional(),

  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

  contact: ContactSchema.extend({
    secondaryMail: z.string().email().optional(),
  }).optional(),

  source: z.enum(["google", "manual"]).optional(),

  privacy: z.object({
    accepted: z.literal(true),
    acceptedAt: z.string().min(1),
    policyVersion: z.string().min(1),
    source: z.literal("business"),
  }).optional(),

  verified: z.literal(false).optional(),
  complete: z.boolean().default(false).optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
});
