/**
DEPRECATED .... TO DELETE 
import { z } from "zod";

export const ReferralSchema = z.object({
  code: z.string().min(6),

  ownerUserId: z.string().uuid(), // chi ha generato il referral
  redeemedByUserId: z.string().uuid().nullable(),

  businessId: z.string().uuid().nullable(),

  status: z.enum([
    "issued",     // creato ma non usato
    "redeemed",   // usato ma business non ancora attivo
    "confirmed",  // admin conferma → bonus attivo
    "expired",
  ]),

  rewardType: z.enum([
    "discount",
    "credit",
    "token",
  ]).nullable(),

  rewardValue: z.number().nullable(),

  createdAt: z.string(),
  redeemedAt: z.string().nullable(),
  confirmedAt: z.string().nullable(),
});

export type ReferralDTO = z.infer<typeof ReferralSchema>;
**/