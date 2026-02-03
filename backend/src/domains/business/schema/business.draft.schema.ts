//be/..../business.draft.schema.ts


import { z } from "zod";
import { OpeningHoursSchema } from "@domains/GeneralSchema/hours.opening.schema";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";

export const BusinessDraftSchema = z.object({
  /* Identity */
  id: z.string().min(1),
  configurationId: z.string().min(1),
  userId: z.string(),

  /* Core */
  businessName: z.string().min(1),

  /* Commercial */
  solutionId: z.string().min(1),
  productId: z.string().min(1),

  /* Domain */
  openingHours: OpeningHoursSchema,

  /* ✅ CONTACT & ADDRESS (NEW CANONICAL) */
  contact: ContactSchema,
  address: AddressSchema.optional(),

  /* Classification */
  businessDescriptionTags: z.array(z.string()).default([]),
  businessServiceTags: z.array(z.string()).default([]),

  

  /* Status */
  verified: z.literal(false),
  complete: z.boolean().default(false),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
