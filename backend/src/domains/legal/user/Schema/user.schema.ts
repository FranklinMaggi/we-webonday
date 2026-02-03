import { z } from "zod";
import { UserLegalSchema } from "./user.legal.schema";


export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),

  passwordHash: z.string().optional(),

  authProviders: z.array(z.object({
    provider: z.enum(["password", "google", "apple"]),
    providerUserId: z.string(),
  })).optional(),

  referralId: z.string().optional(),
  configurationIds: z.array(z.string().uuid()).optional(),
  legal:UserLegalSchema, 
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  membershipLevel :z.enum(["copper", "silver" , "gold" , "platinum"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  deletedAt: z.string().datetime().optional(),
});