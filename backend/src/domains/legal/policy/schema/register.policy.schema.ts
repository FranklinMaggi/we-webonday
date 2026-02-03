import { z } from "zod";

export const RegisterPolicySchema = z.object({
  type: z.enum(["cookie", "privacy", "terms"]),
  scope: z.enum(["general", "configurator", "checkout"]),
  version: z.string().min(1),

  renderMode: z.enum(["readable", "contractual"]),

  locale: z.string().default("it-IT"),

  content: z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("readable"),
      title: z.string().min(1),
      body: z.string().min(1),
      updatedAt: z.string().datetime(),
    }),
    z.object({
      kind: z.literal("contractual"),
      title: z.string().min(1),
      updatedAt: z.string().datetime(),
      sections: z.array(
        z.object({
          id: z.string().min(1),
          title: z.string().min(1),
          text: z.string().min(1),
        })
      ),
    }),
  ]),

  effectiveAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
});