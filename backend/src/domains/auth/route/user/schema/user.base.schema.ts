import { z } from "zod";
import { UserLegalBaseSchema } from "./user.legal.base.schema";

export const UserBaseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),

  passwordHash: z.string().optional(),

  authProviders: z.array(
    z.object({
      provider: z.enum(["password", "google", "apple"]),
      providerUserId: z.string(),
    })
  ).optional(),

  membershipLevel: z.enum(["copper", "silver", "gold", "platinum"]),

  legal: UserLegalBaseSchema,

  status: z.enum(["active", "inactive", "suspended"]),
  createdAt: z.string().datetime(),
});