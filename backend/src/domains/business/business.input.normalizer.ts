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
import { OpeningHoursSchema } from "./schema/business.schema";
import {type  BusinessOpeningHoursDTO } from "./business.public.dto";


export interface BusinessInput {
  name?: unknown;
  address?: unknown;
  phone?: unknown;

  // FE manda object -> qui lo serializziamo in JSON string
  openingHours?: unknown;

  referredBy?: unknown;

  // ORIGINE COMMERCIALE (necessaria per nuovo schema)
  solutionId?: unknown;
  productId?: unknown;
  optionIds?: unknown;
}

export interface NormalizedBusinessInput {
  name: string;
  address: string;
  phone: string;

  openingHours: string | null;

  referredBy: string | null;

  solutionId: string;
  productId: string;
  optionIds: string[];
}

function normalizeOpeningHours(value: unknown): string | null {
  if (value == null) return null;

  // se FE manda già una stringa (legacy) la accettiamo
  if (typeof value === "string") return value.trim() || null;

  // se FE manda oggetto -> JSON string (evita "[object Object]")
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return null;
    }
  }

  return null;
}

export function normalizeBusinessInput(
  input: BusinessInput
): NormalizedBusinessInput {
  const optionIdsRaw = input.optionIds;

  return {
    name: String(input.name ?? "").trim(),
    address: String(input.address ?? "").trim(),
    phone: String(input.phone ?? "").trim(),

    openingHours: normalizeOpeningHours(input.openingHours),

    referredBy:
      input.referredBy != null ? String(input.referredBy) : null,

    solutionId: String(input.solutionId ?? "").trim(),
    productId: String(input.productId ?? "").trim(),

    optionIds: Array.isArray(optionIdsRaw)
      ? optionIdsRaw.map((x) => String(x)).filter(Boolean)
      : [],
  };
}

/* ======================================================
 * NORMALIZE INPUT (FE → BE)
 * ====================================================== */
export function normalizeOpeningHoursInput(
  raw: unknown
): BusinessOpeningHoursDTO {
  return OpeningHoursSchema.parse(raw);
}

/* ======================================================
 * NORMALIZE OUTPUT (BE → FE)
 * ====================================================== */
export function normalizeOpeningHoursToPublic(
  openingHours: BusinessOpeningHoursDTO
): BusinessOpeningHoursDTO {
  return openingHours;
}


export interface NormalizedBusinessBaseInput {
  name: string;
  address: string;
  phone: string;
  openingHours: string | null;

  solutionId: string;
  productId: string;
  optionIds: string[];

  referredBy: string | null;
}