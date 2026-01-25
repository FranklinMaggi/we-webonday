//be/..../business.draft.schema.ts


import { z } from "zod";
import { BusinessContactSchema } from "./business.contact.schema";
import { OpeningHoursSchema } from "./business.schema";
export const BusinessDraftSchema = z.object({
  /* ---------- Identity ---------- */
  id: z.string().min(1),
  configurationId: z.string().min(1),
  userId: z.string(),

  /* ---------- Core ---------- */
  businessName: z.string().min(1),

  /* ---------- Commercial origin ---------- */
  solutionId: z.string().min(1),
  productId: z.string().min(1),

  /* ---------- Opening hours ---------- */



  // ✅ DOMINIO — SOURCE OF TRUTH
  openingHours: OpeningHoursSchema,

  /* ---------- Contact ---------- */
  contact: BusinessContactSchema,

  /* ---------- Classification ---------- */
  businessDescriptionTags: z.array(z.string()).default([]),
  businessServiceTags: z.array(z.string()).default([]),

  privacy: z.object({
    accepted: z.boolean(),
    acceptedAt: z.string(),
    policyVersion: z.string(),
  }),

  /* ---------- Status ---------- */
  verified: z.literal(false),
  complete: z.boolean().default(false),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
