/* ======================================================
   AI-SUPERCOMMENT
   DOMAIN || BUSINESS || SCHEMA
======================================================

RUOLO:
- Source of Truth del dominio Business
- Definisce struttura, vincoli e default di dominio

CONTENUTO:
- Zod schema canonico
- Stati ammessi
- Campi obbligatori e opzionali

INVARIANTI:
- Tutti i Business persistiti DEVONO validare questo schema
- createdAt è parte del dominio
- status è controllato dal backend
- OpeningHours è SEMPRE strutturato (mai stringhe)

NON DEVE:
- NON normalizzare input
- NON serializzare
- NON esporre DTO pubblici
- NON contenere logica applicativa

DIPENDENZE:
- Usato da:
  - routes/tenant/business
  - routes/admin/business
  - business.normalizer.ts

IMPATTO MODIFICHE:
- Cambiare questo schema richiede audit di:
  - normalizer
  - DTO FE
  - API pubbliche
====================================================== */

import { z } from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";

/* ======================================================
 * TIME RANGE
 * ====================================================== */
/**
 * Rappresenta una singola fascia oraria
 * es: { from: "09:00", to: "13:00" }
 */
export const TimeRangeSchema = z.object({
  from: z.string(), // HH:mm
  to: z.string(),   // HH:mm
});

export type TimeRangeDTO = z.infer<typeof TimeRangeSchema>;

/* ======================================================
 * OPENING HOURS (BUSINESS)
 * SOURCE OF TRUTH
 * ====================================================== */
/**
 * Orari settimanali strutturati
 * - Giorno chiuso  → array vuoto []
 * - H24            → [{ from: "00:00", to: "24:00" }]
 * - Turni multipli → più TimeRange
 */
export const OpeningHoursSchema = z.object({
  monday: z.array(TimeRangeSchema).default([]),
  tuesday: z.array(TimeRangeSchema).default([]),
  wednesday: z.array(TimeRangeSchema).default([]),
  thursday: z.array(TimeRangeSchema).default([]),
  friday: z.array(TimeRangeSchema).default([]),
  saturday: z.array(TimeRangeSchema).default([]),
  sunday: z.array(TimeRangeSchema).default([]),
});

export type OpeningHoursDTO = z.infer<typeof OpeningHoursSchema>;

/* ======================================================
 * BUSINESS — DOMAIN ENTITY
 * ====================================================== */
export const BusinessSchema = z.object({
  /* =========================
     IDENTITÀ
  ========================= */
  id: z.string().uuid(),
  publicId: z.string().min(3),

  ownerUserId: z.string().uuid(),
  createdByUserId: z.string().uuid(),

  /* =========================
     RUOLI COLLABORATIVI
  ========================= */
  editorUserIds: z.array(z.string().uuid()).default([]),

  /* =========================
     ANAGRAFICA
  ========================= */
  name: z.string().min(2),
  contact: ContactSchema.optional(),

  /* =========================
     ORARI
  ========================= */
  openingHours: OpeningHoursSchema.optional(),

  /* =========================
     TAG SEMANTICI
  ========================= */
  descriptionTags: z.array(z.string()).default([]),
  serviceTags: z.array(z.string()).default([]),

  /* =========================
     ORIGINE COMMERCIALE
  ========================= */
  solutionId: z.string().optional(),
  productId: z.string().optional(),
  optionIds: z.array(z.string()).default([]),

  /* =========================
     MEDIA
  ========================= */
  coverImageUrl: z.string().url().nullable(),
  logoUrl: z.string().url().nullable(),
  galleryImageUrls: z.array(z.string().url()).max(12).default([]),

  /* =========================
     DESIGN SEMANTICO
  ========================= */
  designProfile: z
    .object({
      category: z.string().optional(),
      tone: z.string().optional(),
    })
    .optional(),

  /* =========================
     REFERRAL
  ========================= */
  referredByReferralId: z.string().uuid().optional(),

  /* =========================
     STATO
  ========================= */
  status: z
    .enum(["verified", "pending", "active", "suspended"])
    .default("pending"),

  /* =========================
     TIMESTAMPS
  ========================= */
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type BusinessDTO = z.infer<typeof BusinessSchema>;
