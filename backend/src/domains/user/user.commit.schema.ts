import { z } from "zod";

export const UserCommitSchema = z.object({
  id: z.string().uuid(),

  userId: z.string().uuid(),
  configurationId: z.string().uuid(),

  committedAt: z.string(), // ISO
  source: z.enum(["configuration_commit"]),

  // snapshot minimale (difensivo)
  businessDraftId: z.string().optional(),
  ownerDraftId: z.string().optional(),
});

export type UserCommitDTO = z.infer<typeof UserCommitSchema>;
