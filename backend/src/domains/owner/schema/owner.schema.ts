import { z } from "zod";
import { OwnerDocumentsSchema } from "./owner.document.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";

export const OwnerSchema = z.object({
   id: z.string().uuid(),      // === userId
   userId: z.string().uuid(), // duplicato semantico OK
 
   firstName: z.string().min(1).optional(),
   lastName: z.string().min(1).optional(),
   birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
 
   address: AddressSchema.optional(),
   contact: ContactSchema.optional(),
 
   source: z.enum(["google", "manual"]).optional(),
 
   documents: OwnerDocumentsSchema.default({
     front: undefined,
     back: undefined,
   }),
   ownerDataComplete: z.boolean().default(false),
   verification: z.enum([
      "DRAFT",
     "PENDING",
     "ACCEPTED",
     "REJECTED",
   ]).default("DRAFT"),
 
   verifiedAt: z.string().datetime().optional(),
 
   createdAt: z.string(),
   updatedAt: z.string(),
 });
 