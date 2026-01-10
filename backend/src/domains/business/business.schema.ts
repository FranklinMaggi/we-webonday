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

NON DEVE:
- NON normalizzare input
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

export const BusinessSchema = z.object({
  /* =========================
     IDENTITÀ
  ========================= */
  id: z.string().uuid(),
  publicId: z.string().min(3),
  ownerUserId: z.string().uuid(),

  /* =========================
     ANAGRAFICA
  ========================= */
  name: z.string().min(2),
  address: z.string(),
  phone: z.string(),

  openingHours: z.string().optional(),

  /* =========================
     ORIGINE COMMERCIALE
  ========================= */
  solutionId: z.string(),
  productId: z.string(),
  optionIds: z.array(z.string()).default([]),

  /* =========================
     MEDIA (IDENTITÀ VISIVA)
  ========================= */
  coverImageUrl: z.string().url().nullable(),
  logoUrl: z.string().url().nullable(),
  galleryImageUrls: z
    .array(z.string().url())
    .max(12)
    .default([]),

  /* =========================
     DESIGN SEMANTICO (NON RENDER)
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
  referralToken: z.string().min(6),
  referredBy: z.string().nullable(),

  /* =========================
     STATO
  ========================= */
  status: z
    .enum(["draft", "pending", "active", "suspended"])
    .default("draft"),

  createdAt: z.string(),
});

export type BusinessDTO = z.infer<typeof BusinessSchema>;