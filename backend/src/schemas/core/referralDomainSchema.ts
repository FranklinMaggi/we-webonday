import { z } from "zod";

export const ReferralDomainSchema = z.object({
  code: z.string(),
  ownerUserId: z.string(),
  createdAt: z.string(),
  status: z.enum(["issued","redeemed","confirmed","expired"]),
  invitedBusinessIds: z.array(z.string()),
});

export type ReferralDTO = z.infer<typeof ReferralDomainSchema>;
