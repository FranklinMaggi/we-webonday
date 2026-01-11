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

/**
 * ======================================================
 * SEO TAG (BASE)
 * ======================================================
 */
export const SeoTagSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: "Tag must be kebab-case lowercase (es. camere-sul-mare)",
  });

/**
 * ======================================================
 * USER GENERATED TAGS — MODERATION
 * ======================================================
 */
const UserTagStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const UserGeneratedTagMetaSchema = z.object({
  tag: SeoTagSchema,
  status: UserTagStatusSchema.default("PENDING"),
  createdBy: z.string().optional(), // userId (futuro)
  createdAt: z.string().datetime(),
});

/**
 * ======================================================
 * SOLUTION SCHEMA
 * ======================================================
 */
export const SolutionSchema = z.object({
  id: z.string().min(1),           // "food"
  name: z.string().min(1),         // "Ristoranti & Food"

  // Copy editoriale (NON SEO)
  description: z.string().min(1).optional(),
  longDescription: z.string().optional(),

  icon: z.string().optional(),
  imageKey: z.string().optional(),

  /**
   * TAG SEMANTICI SEED (CANONICI)
   * - definiti da admin / seed
   * - suggeriti al FE
   */
  tags: z.array(SeoTagSchema).default([]),

  /**
   * TAG GENERATI DAGLI UTENTI (FLAT)
   * - append-only
   * - solo stringhe
   * - UX / FE friendly
   */
  userGeneratedTags: z.array(SeoTagSchema).default([]),

  /**
   * META COMPLETA DI MODERAZIONE
   * - source of truth
   * - admin-ready
   */
  userGeneratedTagsMeta: z
    .array(UserGeneratedTagMetaSchema)
    .default([]),

  /**
   * Categorie macro (NON SEO)
   */
  industries: z.array(z.string()).default([]),

  /**
   * Relazione dichiarativa Solution → Product
   */
  productIds: z.array(z.string()).default([]),

  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  createdAt: z.string().datetime(),
});

export type Solution = z.infer<typeof SolutionSchema>;
