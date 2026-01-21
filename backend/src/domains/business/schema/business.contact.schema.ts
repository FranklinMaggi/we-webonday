import { z } from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";

export const BusinessContactSchema = ContactSchema.extend({
  mail: z.string().email(), // ✅ OBBLIGATORIA PER BUSINESS
  pec: z.string().email().optional(),
});
