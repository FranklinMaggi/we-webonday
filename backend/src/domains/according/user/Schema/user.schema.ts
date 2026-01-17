import { z } from "zod";
import { userProfile } from "./profile.schema";


export const UserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional()
});


export type UserInputDTO = z.infer<typeof UserInputSchema>;

/* ===========================================
   User salvato nel sistema (DTO interno)
   =========================================== */
export const UserSchema = z.object({

  id: z.string().uuid(),
  email: z.string().email(),
  passwordHash: z.string().optional(),

  profile: userProfile.optional(),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  createdAt: z.string() // ISO string
});

export type UserDTO = z.infer<typeof UserSchema>;
