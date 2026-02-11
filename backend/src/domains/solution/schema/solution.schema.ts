import { z } from "zod";
import { OpeningHoursSchema } from "@domains/GeneralSchema/hours.opening.schema";

/* ======================================================
 * SEO TAG (BASE)
====================================================== */
export const TagSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: "Tag must be kebab-case lowercase",
  });

/* ======================================================
   SOLUTION SCHEMA (CANONICAL)
====================================================== */

/* ======================================================
   SOLUTION SCHEMA (CANONICAL)
====================================================== */

export const SolutionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),

  /**
   * Descrizione generale della solution
   * - tono informativo
   * - non marketing aggressivo
   * - usata in preview / SEO / AI seed
   */
  solutionDescriptionText: z.string().optional(),

  /**
   * Descrizione dei servizi abilitati dalla solution
   * - cosa permette di fare
   * - cosa include
   * - usata per preview site-like
   */
  solutionServiceDescriptionText: z.string().optional(),

  /** legacy / opzionali */
  description: z.string().optional(),
  longDescription: z.string().optional(),

  icon: z.string().optional(),
  imageKey: z.string().optional(),

  descriptionTags: z.array(TagSchema).default([]),
  serviceTags: z.array(TagSchema).default([]),

  industries: z.array(z.string()).default([]),
  productIds: z.array(z.string()).default([]),

  /**
   * 🔑 OPENING HOURS (SEED)
   */
  openingHours: OpeningHoursSchema.optional(),

  /**
   * TEMPLATE PRESETS (MARKETING / PREVIEW)
   */
  templatePresets: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        previewImage: z.string().url(),
        gallery: z.array(z.string().url()).min(1),
        style: z.enum([
          "modern",
          "elegant",
          "minimal",
          "bold",
        ]),
        palette: z.enum([
          "warm",
          "dark",
          "light",
          "pastel",
          "corporate",
        ]),
      })
    )
    .optional(),

  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});


export type Solution = z.infer<typeof SolutionSchema>;
