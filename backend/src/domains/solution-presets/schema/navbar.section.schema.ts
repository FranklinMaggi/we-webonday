// ======================================================
// BE || CANVAS SECTIONS SCHEMA
// ======================================================

import { z } from "zod";

export const NavbarSectionSchema = z.object({
  type: z.literal("navbar"),

  logo: z.object({
    source: z.enum(["business", "prompt"]),
  }),

  title: z.object({
    source: z.literal("business.name"),
  }),

  actions: z.array(
    z.object({
      type: z.literal("dropdown"),
      label: z.string(),
    })
  ).optional(),
});
