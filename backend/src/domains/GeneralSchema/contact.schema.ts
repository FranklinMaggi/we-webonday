// DOMAIN || SHARED || CONTACT.schema.ts
import { z } from "zod";
import { AddressSchema } from "./address.schema";

/**
 * ContactSchema (CANONICAL)
 *
 * - NON impone obblighi
 * - I vincoli vengono applicati negli schema superiori
 */
export const ContactSchema = z.object({
  mail: z.string().email().optional(),
  pec: z.string().email().optional(),
  phoneNumber: z.string().min(1).optional(),
}).passthrough(); // 🔑 CRITICO

export type ContactDTO = z.infer<typeof ContactSchema>;
