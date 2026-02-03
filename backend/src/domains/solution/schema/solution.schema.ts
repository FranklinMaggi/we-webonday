/* AI-SUPERCOMMENT
 * FILE: backend/src/schemas/core/solutionSchema.ts
 *
 * RUOLO:
 * - Schema canonico Solution
 * - Seed semantico per business auto-configuranti
 *
 * INVARIANTI:
 * - tags ≠ businessTags
 * - tags = seed canonico SEO
 * - userGeneratedTags = append-only (UX / FE)
 * - userGeneratedTagsMeta = verità + moderazione
 */

import { z } from "zod";
import { OpeningHoursSchema } from "@domains/GeneralSchema/hours.opening.schema";
/**
 * ======================================================
 * SEO TAG (BASE)
 * ======================================================
 */
export const TagSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: "Tag must be kebab-case lowercase (es. camere-sul-mare)",
  });

/**
/**
 * ======================================================
 * USER SERVICE TAGS — LEARNING PIPELINE
 * ======================================================
 *
 * RUOLO:
 * - Servizi inseriti dagli utenti
 * - Usati per:
 *   • suggerimenti futuri
 *   • clustering AI
 *   • arricchimento seed
 *
 * NON SONO:
 * - canonici
 * - immediatamente riutilizzabili
 */

const UserServiceTagStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const UserServiceTagMetaSchema = z.object({
  tag: TagSchema,
  status: UserServiceTagStatusSchema.default("PENDING"),
  createdBy: z.string().optional(), // userId
  createdAt: z.string().datetime(),
});


/* ======================================================
   SOLUTION SCHEMA (CANONICAL)
====================================================== */

export const SolutionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),

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
   * - Stesso dominio del Business
   * - Stesso schema
   * - Stesso tipo
   * - NON obbligatorio
   */
  openingHours: OpeningHoursSchema.optional(),

  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  createdAt: z.string().datetime(),
});

export type Solution = z.infer<typeof SolutionSchema>;
