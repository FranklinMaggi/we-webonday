import { z } from "zod";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";

export const LegalRepresentativeSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const LegalIdentitySchema = z.object({
  pec: z.string().email().optional(),
  vat: z.string().min(5).optional(),
  registeredOffice: AddressSchema.optional(),
  legalRepresentative: LegalRepresentativeSchema.optional(),
});
