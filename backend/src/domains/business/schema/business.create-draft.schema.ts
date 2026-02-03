import { z } from "zod";
import { OpeningHoursSchema } from "@domains/GeneralSchema/hours.opening.schema";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";
export const CreateBusinessDraftSchema = z.object({
  configurationId: z.string(),
  solutionId: z.string(),
  productId: z.string(),

  businessName: z.string().min(1),

  openingHours: OpeningHoursSchema,

  contact: ContactSchema.refine(
    (c) => !!c.mail,
    { message: "MAIL_REQUIRED_FOR_BUSINESS" }
  ),

  // ZIP PUÒ ESSERE VUOTO → OK
  address: AddressSchema.optional(),

  businessDescriptionTags: z.array(z.string()).optional(),
  businessServiceTags: z.array(z.string()).optional(),

});
