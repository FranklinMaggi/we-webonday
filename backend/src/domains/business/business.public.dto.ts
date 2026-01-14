/* ======================================================
   AI-SUPERCOMMENT
   DOMAIN || BUSINESS || PUBLIC DTO
======================================================

RUOLO:
- Contratto API pubblico per Business
- Usato da:
  - /api/business/public/*
  - frontend (read-only)

CONTENUTO:
- Solo campi sicuri
- Nessuna informazione sensibile

INVARIANTI:
- Non contiene ownerUserId
- Non contiene referralToken
- Non contiene stato interno avanzato

MODIFICHE:
- Ogni modifica richiede audit FE
====================================================== */


export interface BusinessPublicDTO {
  id: string;
  name: string;
  address: string;
  phone: string;
  openingHours?: string | null;
  menuPdfUrl: string | null;
}import { z } from "zod";

/* ======================================================
 * TIME RANGE
 * ====================================================== */
export const TimeRangeSchema = z.object({
  from: z.string(), // "09:00"
  to: z.string(),   // "13:00"
});

/* ======================================================
 * OPENING HOURS (BUSINESS)
 * SOURCE OF TRUTH
 * ====================================================== */
export const OpeningHoursSchema = z.object({
  monday: z.array(TimeRangeSchema).default([]),
  tuesday: z.array(TimeRangeSchema).default([]),
  wednesday: z.array(TimeRangeSchema).default([]),
  thursday: z.array(TimeRangeSchema).default([]),
  friday: z.array(TimeRangeSchema).default([]),
  saturday: z.array(TimeRangeSchema).default([]),
  sunday: z.array(TimeRangeSchema).default([]),
});


export type BusinessOpeningHoursDTO = {
  monday: { from: string; to: string }[]
  tuesday: { from: string; to: string }[]
  wednesday: { from: string; to: string }[]
  thursday: { from: string; to: string }[]
  friday: { from: string; to: string }[]
  saturday: { from: string; to: string }[]
  sunday: { from: string; to: string }[]
}
