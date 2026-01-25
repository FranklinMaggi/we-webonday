// DOMAIN || PERSON || BASE.schema.ts
import { z } from "zod";
import { ContactSchema } from "./contact.schema";

export const PersonSchema = z.object({
  id: z.string().uuid(),

  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),

  contact: ContactSchema.optional(),

  verified: z.boolean().optional(),
});

export type PersonDTO = z.infer<typeof PersonSchema>;

