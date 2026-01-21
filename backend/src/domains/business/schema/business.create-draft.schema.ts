//be..../business.create-draft.schema.ts

import { z } from "zod";
import { BusinessContactSchema } from "./business.contact.schema";

export const CreateBusinessDraftSchema = z.object({
    /* ---------- Business ---------- */
    businessName: z.string().min(1),
    configurationId:z.string().min(1),
   
    solutionId: z.string().min(1),
    productId: z.string().min(1),

    businessOpeningHour: z.record(z.unknown()),
  
    contact:BusinessContactSchema,
  
    businessDescriptionTags: z.array(z.string()).default([]),
    businessServiceTags: z.array(z.string()).default([]),
    privacy: z.object({
      accepted: z.literal(true),
      acceptedAt: z.string().min(1),
      policyVersion: z.string().min(1),
    }),
});
  
  export type CreateBusinessDraftDTO = z.infer<
    typeof CreateBusinessDraftSchema
  >;
  