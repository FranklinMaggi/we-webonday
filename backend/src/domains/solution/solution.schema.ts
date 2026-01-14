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
  descriptionTags: z.array(TagSchema).default([]),

  /**
   * TAG GENERATI DAGLI UTENTI (FLAT)
   * - append-only
   * - solo stringhe
   * - UX / FE friendly
   */
  userGeneratedTags: z.array(TagSchema).default([]),

  /**
   * META COMPLETA DI MODERAZIONE
   * - source of truth
   * - admin-ready
   */
  userGeneratedTagsMeta: z
    .array(UserServiceTagMetaSchema)
    .default([]),

  /**
   * Categorie macro (NON SEO)
   */
  industries: z.array(z.string()).default([]),

  /**
   * Relazione dichiarativa Solution → Product
   */
  productIds: z.array(z.string()).default([]),
 /**
 * ======================================================
 * SERVICE TAGS — BUSINESS SEMANTICS
 * ======================================================
 */

// canonici (seed)
serviceTags: z.array(TagSchema).default([]),

// flat user input (UX-friendly)
userServiceTags: z.array(TagSchema).default([]),

// source of truth + moderation
userServiceTagsMeta: z
  .array(UserServiceTagMetaSchema)
  .default([]),


  openingHoursDefault: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }).optional(),
  
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  createdAt: z.string().datetime(),
});

export type Solution = z.infer<typeof SolutionSchema>;
/**
 * INVARIANTI SERVICE TAGS:
 *
 * 1. serviceTags = SOLO admin / seed
 * 2. userServiceTags = append-only
 * 3. userServiceTags NON influiscono direttamente su layout
 * 4. solo serviceTags APPROVATI possono:
 *    - guidare layout
 *    - influenzare AI
 *    - diventare seed
 */