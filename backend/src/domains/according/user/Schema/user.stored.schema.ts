import { z } from "zod";
import { UserSchema } from "./user.schema";
import { VisitorSchema } from "./visitor.schema";

export const UserStoredSchema = UserSchema.extend({
  visitor: z.array(VisitorSchema).optional(),

  // placeholders futuri (NON implementati ora)
  account: z.any().optional(),
  profile: z.any().optional(),
  billing: z.any().optional(),
  orders: z.any().optional(),
  business: z.any().optional(),
});

export type UserStoredDTO = z.infer<typeof UserStoredSchema>;
