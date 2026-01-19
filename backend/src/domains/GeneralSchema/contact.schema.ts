// DOMAIN || SHARED || CONTACT.schema.ts
import { z } from "zod";
import { AddressSchema } from "./address.schema";

export const ContactSchema = z.object({
  address: AddressSchema.optional(),

  phoneNumber: z.string().min(1).optional(),
  mail: z.string().email().optional(),
});

export type ContactDTO = z.infer<typeof ContactSchema>;
