import { z } from "zod";

export const UserSelfOutputDTO = z.object({
  id: z.string().uuid(),
  email: z.string().email(),

  userType: z.enum(["private", "business"]),
  membershipLevel: z.enum([
    "FREE",
    "ESSENTIAL",
    "WORKER",
    "INDUSTRIAL",
    "DOMINION",
  ]),

  status: z.enum(["active", "inactive", "suspended"]),
  createdAt: z.string().datetime(),

  // 🔮 FUTURI (opzionali)
  businessName: z.string().nullable().optional(),
  piva: z.string().nullable().optional(),
});

export type UserSelfOutputDTO = z.infer<typeof UserSelfOutputDTO>;
