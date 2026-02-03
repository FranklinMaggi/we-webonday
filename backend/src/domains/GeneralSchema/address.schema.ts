// DOMAIN || SHARED || ADDRESS.schema.ts
import { z } from "zod";

/**
 * AddressSchema (CANONICAL)
 *
 * - Usato da: OwnerDraft, Owner, BusinessDraft
 * - Draft: parzialmente compilabile
 * - Entità finali: reso obbligatorio a livello superiore
 */
export const AddressSchema = z.object({
  street: z.string().min(1).optional(),
  number: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  province: z.string().min(1).optional(),
  region: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
}).passthrough(); // 🔑 CRITICO

export type AddressDTO = z.infer<typeof AddressSchema>;
