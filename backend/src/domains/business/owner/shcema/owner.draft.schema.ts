import {z} from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { PrivacyAcceptanceSchema } from "@domains/configuration/schema/privacy.acceptance.schema";

export const OwnerDraftSchema = z.object({
  id: z.string().uuid().min(1),
  userId: z.string().uuid(),

  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

  contact: ContactSchema.extend({
    secondaryMail: z.string().email().optional(),
  }).optional(),

  source: z.enum(["google", "manual"]),

  privacy:PrivacyAcceptanceSchema.optional(),
  verified: z.boolean().default(false),
  complete: z.boolean(),

  createdAt: z.string(),
  updatedAt: z.string(),
});
