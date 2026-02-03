import { z } from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { OwnerDocumentsSchema } from "./owner.document.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";

export const VerifiedOwnerSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    ownerDraftId: z.string().uuid(),
  
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  
    address: AddressSchema,            // OBBLIGATORIO
    contact: ContactSchema.extend({
      phoneNumber: z.string().min(6),  // telefono obbligatorio qui
    }),
  
    source: z.enum(["google", "manual"]),
  
    documents: z.array(OwnerDocumentsSchema),
  
    verified: z.boolean().default(false),
    verifiedAt: z.string().optional(),
  
    createdAt: z.string(),
    updatedAt: z.string(),
  });
  