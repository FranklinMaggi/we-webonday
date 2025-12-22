import { z } from "zod";

/* ===========================================
   Input ricevuto dal client (registrazione)
   =========================================== */
export const UserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  businessName: z.string().optional().nullable(),
  piva: z.string().optional().nullable(),
});

/* ===========================================
   User salvato nel sistema (DTO interno)
   =========================================== */
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  passwordHash: z.string().optional().nullable(),

  businessName: z.string().optional().nullable(),
  piva: z.string().optional().nullable(),

  userType: z.enum(["private", "business"]),

  membershipLevel: z.enum([
    "FREE",
    "ESSENTIAL",
    "WORKER",
    "INDUSTRIAL",
    "DOMINION",
  ]).default("FREE"),

  status: z.enum(["active", "inactive", "suspended"]).default("active"),

  createdAt: z.string(), // ISO string
});

export type UserDTO = z.infer<typeof UserSchema>;
export type UserInputDTO = z.infer<typeof UserInputSchema>;
