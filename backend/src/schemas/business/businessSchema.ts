import { z } from "zod";

export const BusinessSchema = z.object({
  id: z.string().uuid(),

  ownerUserId: z.string().uuid(),

  name: z.string().min(2),
  address: z.string(),
  phone: z.string(),

  openingHours: z.string().optional(),

  menuPdfUrl: z.string().url().nullable(),

  referralToken: z.string().min(6),
  referredBy: z.string().nullable(),

  status: z.enum(["draft", "active", "suspended"]).default("draft"),

  createdAt: z.string(),
});

export type BusinessDTO = z.infer<typeof BusinessSchema>;
