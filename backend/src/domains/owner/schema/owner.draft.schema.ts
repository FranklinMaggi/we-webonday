import { z } from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";

/**
 * OwnerDraftSchema
 *
 * - Usato nel configurator
 * - Tutto opzionale tranne meta
 * - complete = calcolato dal BE
 *//**
 * OwnerDraftSchema
 *
 * ID CANONICO:
 * - id === configurationId
 *
 * NOTE:
 * - duplicate per compatibilità / chiarezza
 */
export const OwnerDraftSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  configurationId:z.string().uuid(),
  /* ANAGRAFICA */
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

  /* DOMINIO */
  address: AddressSchema.optional(),
  contact: ContactSchema.optional(),

  /* META */
  source: z.enum(["google", "manual"]),
 
  verification: z.enum([
    "PENDING",
    "ACCEPTED",
    "REJECTED",
  ]).default("PENDING"),
  complete: z.boolean(),

  createdAt: z.string(),
  updatedAt: z.string(),
});
