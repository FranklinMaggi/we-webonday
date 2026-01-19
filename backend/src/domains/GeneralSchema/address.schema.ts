// DOMAIN || SHARED || ADDRESS.schema.ts
import { z } from "zod";

export const AddressSchema = z.object({
  street: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  province: z.string().min(1).optional(),
  zip: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
});

export type AddressDTO = z.infer<typeof AddressSchema>;
