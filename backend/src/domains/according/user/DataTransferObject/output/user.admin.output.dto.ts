import { z } from "zod";

export const UserAdminOutputDTO = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  status: z.enum(["active", "inactive", "suspended"]),
  createdAt: z.string().datetime(),
});

export type UserAdminOutputDTO = z.infer<typeof UserAdminOutputDTO>;
