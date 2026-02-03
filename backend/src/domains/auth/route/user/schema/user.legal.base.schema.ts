import { z } from "zod";

export const UserLegalBaseSchema = z.object({
  locale: z.string(),

  privacy: z.object({
    accepted: z.literal(true),
    version: z.string(),
    acceptedAt: z.string().datetime(),
  }),
});

export type UserLegalBaseDTO = z.infer<typeof UserLegalBaseSchema>;