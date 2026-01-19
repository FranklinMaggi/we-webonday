import { z } from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";


export const CreateBusinessDraftSchema = z.object({
    /* ---------- Business ---------- */
    businessName: z.string().min(1),
  
    solutionId: z.string().min(1),
    productId: z.string().min(1),
  
    businessOpeningHour: z.record(z.unknown()),
  
    contact: ContactSchema.extend({
      pec: z.string().email().optional(),
    }),
  
    businessDescriptionTags: z.array(z.string()).default([]),
    businessServiceTags: z.array(z.string()).default([]),
  
  

});
  
  export type CreateBusinessDraftDTO = z.infer<
    typeof CreateBusinessDraftSchema
  >;
  