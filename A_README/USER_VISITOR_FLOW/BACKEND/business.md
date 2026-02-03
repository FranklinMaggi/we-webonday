francescomaggi@MacBook-Pro owner % cd '/Users/francescomaggi/Documents/GitHub/We-WebOnDay/backend/src/domains/business'
francescomaggi@MacBook-Pro business % aidump
AI_DUMP_V1
ROOT: /Users/francescomaggi/Documents/GitHub/We-WebOnDay/backend/src/domains/business
DATE: 2026-01-31T11:52:09Z
INCLUDE_EXT: js,ts,css,tsx,html,json,toml
EXCLUDE_DIRS: .wrangler,node_modules,dist,build,coverage,.next,.cache,.git,frontend/public

=== FILE: DataTransferObject/input/business.draft.input.dto.ts
LANG: ts
SIZE:     1496 bytes
----------------------------------------
/* ======================================================
   DOMAIN || BUSINESS || DRAFT INPUT DTO (CANONICAL)
======================================================

RUOLO:
- DTO canonico per CREAZIONE / UPDATE BusinessDraft
- Usato da:
  - FE (BusinessForm)
  - POST /api/business/create-draft
  - POST /api/business/update-draft

INVARIANTI:
- Dominio = TimeRange (NO stringhe, NO legacy)
- businessDraftId NON richiesto in create
- Backend = source of truth
====================================================== */

import type { OpeningHoursDTO } from "@domains/GeneralSchema/hours.opening.schema";

export interface BusinessDraftInputDTO {
  /* =====================
     LINKAGE
  ====================== */
  configurationId: string;

  /* =====================
     CORE
  ====================== */
  businessName: string;
  solutionId: string;
  productId: string;

  /* =====================
     DOMAIN (CANONICAL)
  ====================== */
  openingHours: OpeningHoursDTO;

  /* =====================
     CONTACT
  ====================== */
  contact: {
    address?: {
      street?: string;
      city?: string;
      province?: string;
      zip?: string;
    };
    phoneNumber?: string;
    mail: string;
    pec?: string;
  };

  /* =====================
     CLASSIFICATION
  ====================== */
  businessDescriptionTags: string[];
  businessServiceTags: string[];

  /* =====================
     STATUS (INVARIANT)
  ====================== */
  verified: false;
}


=== FILE: DataTransferObject/output/business.draft.read.dto.ts
LANG: ts
SIZE:     1301 bytes
----------------------------------------
// ======================================================
// BE || DTO || BusinessDraftBaseReadDTO (READ)
// ======================================================
//
// RUOLO:
// - DTO READ per BusinessDraft
// - Usato per:
//   • Prefill Step Business (FE)
//   • Sync stato BE → FE
//
// SOURCE OF TRUTH:
// - BusinessDraftSchema (DOMAIN)
// ======================================================

import type { OpeningHoursDTO } from "@domains/GeneralSchema/hours.opening.schema";
// ⬆️ oppure importa dal punto canonico dove è definito

export type BusinessDraftBaseReadDTO = {
  businessDraftId: string;

  businessName: string;
  solutionId: string;
  productId: string;

  /* =====================
     DOMAIN — CANONICAL
  ====================== */
  openingHours: OpeningHoursDTO;

  /* =====================
     CONTACT
  ====================== */
  contact: {
    address?: {
      street?: string;
      city?: string;
      province?: string;
      zip?: string;
    };
    phoneNumber?: string;
    mail: string;
    pec?: string;
  };

  /* =====================
     CLASSIFICATION
  ====================== */
  businessDescriptionTags: string[];
  businessServiceTags: string[];

  /* =====================
     STATUS
  ====================== */
  verified: false;
};


=== FILE: DataTransferObject/output/business.preview.read.dto.ts
LANG: ts
SIZE:     1128 bytes
----------------------------------------
// ======================================================
// BE || DTO || BusinessPreviewReadDTO (CANONICAL)
// ======================================================
//
// RUOLO:
// - DTO UNICO per Site Preview
// - Usato dal Workspace FE
// - Derivato da BusinessDraft (FASE 1)
//
// INVARIANTI:
// - NO layout
// - NO palette
// - SOLO contenuto
// - Tollerante (draft incompleti)
// ======================================================

import type { OpeningHoursDTO } from
  "@domains/GeneralSchema/hours.opening.schema";

export type BusinessPreviewReadDTO = {
  /** 
   * ID canonico
   * = configurationId
   */
  configurationId: string;

  /**
   * True finché la preview è basata su Draft
   * (FASE 1 → sempre true)
   */
  isDraft: true;

  /* =========================
     CONTENUTO BUSINESS
  ========================= */

  businessName?: string;

  contact?: {
    phoneNumber?: string;
    mail?: string;
  };

  address?: {
    street?: string;
    city?: string;
    province?: string;
  };

  openingHours?: OpeningHoursDTO;

  businessDescriptionTags?: string[];
  businessServiceTags?: string[];
};

=== FILE: business.normalize-from-draft.ts
LANG: ts
SIZE:     1194 bytes
----------------------------------------
import { OpeningHoursSchema, type OpeningHoursDTO } from "@domains/GeneralSchema/hours.opening.schema"
 /**  Normalizza OpeningHours legacy / parziali
 *
 * - Garantisce tutti i giorni
 * - Scarta valori invalidi
 * - NON interpreta stringhe magiche
 * - Source of truth: OpeningHoursSchema
 */
export function normalizeDraftOpeningHours(
  raw?: Partial<Record<string, unknown>>
): OpeningHoursDTO {

  const result: OpeningHoursDTO = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  if (!raw) {
    return OpeningHoursSchema.parse(result);
  }

  for (const day of Object.keys(result) as (keyof OpeningHoursDTO)[]) {
    const value = raw[day];

    if (!Array.isArray(value)) {
      result[day] = [];
      continue;
    }

    result[day] = value
      .filter(
        (r): r is { from: string; to: string } =>
          typeof r === "object" &&
          r !== null &&
          typeof (r as any).from === "string" &&
          typeof (r as any).to === "string"
      )
      .map((r) => ({
        from: r.from.trim(),
        to: r.to.trim(),
      }));
  }

  return OpeningHoursSchema.parse(result);
}


=== FILE: lib/assertConfigurationOwnershipByBusinessDraft.ts
LANG: ts
SIZE:     1010 bytes
----------------------------------------
import { Env } from "../../../types/env";
import { ConfigurationDTO } from "@domains/configuration";




function normalizeBusinessDraftId(id: string) {
  return id.includes(":") ? id.split(":").pop()! : id;
}
export async function assertConfigurationOwnershipByBusinessDraft(
  env: Env,
  businessDraftId: string,
  userId: string
): Promise<ConfigurationDTO> {

  const canonicalId = normalizeBusinessDraftId(businessDraftId);

  const { keys } = await env.CONFIGURATION_KV.list({
    prefix: "CONFIGURATION:",
  });

  for (const k of keys) {
    const config = await env.CONFIGURATION_KV.get(
      k.name,
      "json"
    ) as ConfigurationDTO | null;

    if (!config?.businessDraftId) continue;

    const configBusinessDraftId =
      normalizeBusinessDraftId(config.businessDraftId);

    if (configBusinessDraftId === canonicalId) {
      if (config.userId !== userId) {
        throw new Error("FORBIDDEN");
      }
      return config;
    }
  }

  throw new Error("BUSINESS_DRAFT_NOT_FOUND");
}


=== FILE: mappers/business.preview.mapper.ts
LANG: ts
SIZE:     1375 bytes
----------------------------------------
// ======================================================
// DOMAIN || BUSINESS || PREVIEW MAPPER
// ======================================================
//
// RUOLO:
// - Converte BusinessDraft (+ OwnerDraft) in PreviewDTO
// - Nessuna validazione forte
// - Tollerante a draft incompleti
// ======================================================

import type { BusinessPreviewDTO } from "@domains/site-preview/shcema/business-site.preview.schema";
import type { z } from "zod";
import { BusinessDraftSchema } from
  "../schema/business.draft.schema";
import { OwnerDraftSchema } from
  "@domains/owner/shcema/owner.draft.schema";

export function mapBusinessPreview(
  businessDraft: z.infer<typeof BusinessDraftSchema>,
  ownerDraft?: z.infer<typeof OwnerDraftSchema>
): BusinessPreviewDTO {
  return {
    configurationId: businessDraft.configurationId,
    isDraft: true,

    businessName: businessDraft.businessName,

    address: businessDraft.address,
    contact: businessDraft.contact,

    openingHours: businessDraft.openingHours,

    descriptionTags:
      businessDraft.businessDescriptionTags ?? [],

    serviceTags:
      businessDraft.businessServiceTags ?? [],

    owner: ownerDraft
      ? {
          firstName: ownerDraft.firstName,
          lastName: ownerDraft.lastName,
        }
      : undefined,

    complete: businessDraft.complete,
  };
}

=== FILE: routes/business.create-draft.ts
LANG: ts
SIZE:     6677 bytes
----------------------------------------
// ======================================================
// BE || BUSINESS || CREATE / UPDATE DRAFT (FASE 1)
// POST /api/business/create-draft
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Crea o aggiorna il BusinessDraft
// - Il BusinessDraft è OWNED dalla Configuration
//
// INVARIANTI ARCHITETTURALI (NON NEGOZIABILI):
// - ID del BusinessDraft === configurationId
// - Nessun businessDraftId separato
// - KV key: BUSINESS_DRAFT:{configurationId}
// - Backend = source of truth
//
// PERCHÉ:
// - Riduce lookup incrociati
// - Semplifica preview e workspace
// - Elimina ambiguità tra Draft e Configuration
// ======================================================

import { z } from "zod";
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import type { ConfigurationDTO } from "@domains/configuration";

import { CreateBusinessDraftSchema } from "../schema/business.create-draft.schema";
import { BusinessDraftSchema } from "../schema/business.draft.schema";

/* ======================================================
   KV KEYS — CANONICAL
====================================================== */
const BUSINESS_DRAFT_KEY = (configurationId: string) =>
  `BUSINESS_DRAFT:${configurationId}`;

/* ======================================================
   COMPLETENESS CHECK — DOMAIN ONLY
====================================================== */
function isBusinessDraftComplete(draft: {
  businessName?: string;
  openingHours?: unknown;
  contact?: { mail?: string };
  address?: {
    street?: string;
    number?: string;
    city?: string;
  };
  privacy?: { accepted?: boolean };
}) {
  return Boolean(
    draft.businessName &&
    draft.openingHours &&
    draft.contact?.mail &&
    draft.address?.street &&
    draft.address?.number &&
    draft.address?.city &&
    draft.privacy?.accepted === true
  );
}

/* ======================================================
   HANDLER
====================================================== */
export async function createBusinessDraft(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  /* =====================
     2️⃣ INPUT VALIDATION
  ====================== */
  let input: z.infer<typeof CreateBusinessDraftSchema>;
  try {
    input = CreateBusinessDraftSchema.parse(
      await request.json()
    );
  } catch (err) {
    return json(
      { ok: false, error: "INVALID_INPUT", details: String(err) },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
     (SOURCE OF TRUTH)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${input.configurationId}`,
    "json"
  ) as ConfigurationDTO | null;

  if (!configuration) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  if (configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  if (
    configuration.solutionId !== input.solutionId ||
    configuration.productId !== input.productId
  ) {
    return json(
      { ok: false, error: "COMMERCIAL_MISMATCH" },
      request,
      env,
      409
    );
  }

  /* =====================
     4️⃣ CANONICAL ID
     BusinessDraft === Configuration
  ====================== */
  const configurationId = configuration.id;
  const now = new Date().toISOString();

  /* =====================
     5️⃣ LOAD EXISTING DRAFT
  ====================== */
  const existingRaw = await env.BUSINESS_KV.get(
    BUSINESS_DRAFT_KEY(configurationId)
  );

  /* =====================================================
     CREATE — FIRST WRITE
  ===================================================== */
  if (!existingRaw) {
    const complete = isBusinessDraftComplete({
      businessName: input.businessName,
      openingHours: input.openingHours,
      contact: input.contact,
      address: input.address,
      privacy: input.privacy,
    });

    const candidate = {
      id: configurationId,
      configurationId,

      userId: session.user.id,

      businessName: input.businessName,
      solutionId: input.solutionId,
      productId: input.productId,

      address: input.address,
      openingHours: input.openingHours,

      contact: input.contact,

      businessDescriptionTags: input.businessDescriptionTags ?? [],
      businessServiceTags: input.businessServiceTags ?? [],

      privacy: input.privacy,

      complete,
      verified: false as const,

      createdAt: now,
      updatedAt: now,
    };

    const draft = BusinessDraftSchema.parse(candidate);

    await env.BUSINESS_KV.put(
      BUSINESS_DRAFT_KEY(configurationId),
      JSON.stringify(draft)
    );

    return json(
      {
        ok: true,
        configurationId,
        businessDraftId: configurationId, // alias legacy FE
        reused: false,
      },
      request,
      env
    );
  }

  /* =====================================================
     UPDATE — MERGE + VALIDATE
  ===================================================== */
  const existing = BusinessDraftSchema.parse(
    JSON.parse(existingRaw)
  );

  const merged = {
    ...existing,

    businessName: input.businessName ?? existing.businessName,
    openingHours: input.openingHours ?? existing.openingHours,
    contact: input.contact ?? existing.contact,
    address: input.address ?? existing.address,

    businessDescriptionTags:
      input.businessDescriptionTags ??
      existing.businessDescriptionTags,

    businessServiceTags:
      input.businessServiceTags ??
      existing.businessServiceTags,

    privacy: input.privacy ?? existing.privacy,

    // invarianti
    solutionId: existing.solutionId,
    productId: existing.productId,

    verified: false as const,
    createdAt: existing.createdAt,
    updatedAt: now,
  };

  merged.complete = isBusinessDraftComplete(merged);

  const validated = BusinessDraftSchema.parse(merged);

  await env.BUSINESS_KV.put(
    BUSINESS_DRAFT_KEY(configurationId),
    JSON.stringify(validated)
  );

  return json(
    {
      ok: true,
      configurationId,
      businessDraftId: configurationId, // alias legacy FE
      reused: true,
    },
    request,
    env
  );
}

=== FILE: routes/business.draft.list-get.ts
LANG: ts
SIZE:     3540 bytes
----------------------------------------
// ======================================================
// BE || BUSINESS || DRAFT || LIST (FASE 1)
// GET /api/business/draft/list-get
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Elenca i BusinessDraft COMPLETI dell’utente
// - Usato da Dashboard e Workspace
//
// MODELLO DATI (POST-FASE-1):
// - BusinessDraft è OWNED dalla Configuration
// - ID BusinessDraft === configurationId
// - KV key: BUSINESS_DRAFT:{configurationId}
//
// INVARIANTI:
// - Auth obbligatoria
// - Read-only
// - Draft incompleti esclusi
// - Backend = source of truth
//
// PERCHÉ:
// - Evita join artificiali
// - Riduce ambiguità Draft / Configuration
// - Allinea FE e BE sullo stesso identificatore
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

/* =========================
   DTO (OUTPUT)
========================= */
type BusinessDraftListItemDTO = {
  configurationId: string;
  businessDraftId: string; // alias legacy (=== configurationId)
  businessName: string;
  status: string;
  complete: true;
  createdAt: string;
  updatedAt: string;
};

type ConfigurationIndexItem = {
  status?: string;
};

/* ======================================================
   HANDLER
====================================================== */
export async function listAllBusinessDrafts(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  const userId = session.user.id;

  /* =====================
     2️⃣ LOAD USER CONFIGURATIONS
     (INDEX = SOURCE OF TRUTH)
  ====================== */
  const userConfigIds = await env.CONFIGURATION_KV.get(
    `USER_CONFIGURATIONS:${userId}`,
    "json"
  ) as string[] | null;

  if (!Array.isArray(userConfigIds) || userConfigIds.length === 0) {
    return json({ ok: true, items: [] }, request, env);
  }

  /* =====================
     3️⃣ RESOLVE DRAFTS
  ====================== */
  const items: BusinessDraftListItemDTO[] = [];

  for (const configurationId of userConfigIds) {
    /* --- load configuration (status only) --- */
    const configuration = await env.CONFIGURATION_KV.get(
      `CONFIGURATION:${configurationId}`,
      "json"
    ) as ConfigurationIndexItem | null;

    if (!configuration) continue;

    /* --- load business draft (owned by configuration) --- */
    const rawDraft = await env.BUSINESS_KV.get(
      `BUSINESS_DRAFT:${configurationId}`
    );

    if (!rawDraft) continue;

    let draft: any;
    try {
      draft = JSON.parse(rawDraft);
    } catch {
      // draft corrotto → ignorato
      continue;
    }

    /* =====================
       DOMAIN GUARD
    ====================== */
    if (draft.complete !== true) continue;

    items.push({
      configurationId,
      businessDraftId: configurationId, // alias legacy FE
      businessName: draft.businessName ?? "Attività",
      status: configuration.status ?? "UNKNOWN",
      complete: true,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
    });
  }

  /* =====================
     4️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true, items },
    request,
    env
  );
}

=== FILE: routes/business.get.base-draft.ts
LANG: ts
SIZE:     3213 bytes
----------------------------------------
// ======================================================
// BE || BUSINESS || GET BASE DRAFT (FASE 1)
// GET /api/business/draft?configurationId=
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Recupera il BusinessDraft associato a una Configuration
// - Usato per il PREFILL dello step Business nel configuratore
//
// MODELLO DATI (POST-FASE-1):
// - BusinessDraft è OWNED dalla Configuration
// - ID BusinessDraft === configurationId
// - KV key: BUSINESS_DRAFT:{configurationId}
//
// INVARIANTI:
// - Auth obbligatoria
// - Read-only
// - Backend = source of truth
//
// PERCHÉ:
// - Evita lookup indiretti
// - Semplifica preview e flusso guidato
// - Elimina mismatch concettuali tra Draft e Configuration
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import { BusinessDraftSchema } from "../schema/business.draft.schema";
import type { ConfigurationDTO } from "@domains/configuration";

export async function getBusinessDraft(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  /* =====================
     2️⃣ INPUT
  ====================== */
  const configurationId = new URL(request.url)
    .searchParams.get("configurationId");

  if (!configurationId) {
    return json(
      { ok: false, error: "MISSING_CONFIGURATION_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
     (SOURCE OF TRUTH)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as ConfigurationDTO | null;

  if (!configuration) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     4️⃣ OWNERSHIP CHECK
  ====================== */
  if (configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     5️⃣ LOAD BUSINESS DRAFT
     (OWNED BY CONFIGURATION)
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    `BUSINESS_DRAFT:${configurationId}`
  );

  // Draft non ancora creato → flusso valido
  if (!raw) {
    return json(
      { ok: true, draft: null },
      request,
      env
    );
  }

  /* =====================
     6️⃣ VALIDATE (DOMAIN)
  ====================== */
  let draft;
  try {
    draft = BusinessDraftSchema.parse(
      JSON.parse(raw)
    );
  } catch {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_CORRUPTED" },
      request,
      env,
      500
    );
  }

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true, draft },
    request,
    env
  );
}

=== FILE: routes/business.preview-get.ts
LANG: ts
SIZE:     2906 bytes
----------------------------------------
// ======================================================
// BE || BUSINESS || PREVIEW
// GET /api/business/preview?configurationId=
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Ritorna la preview live del Business
// - Basata esclusivamente su BusinessDraft (+ OwnerDraft)
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import { BusinessDraftSchema } from "../schema/business.draft.schema";
import { OwnerDraftSchema } from "@domains/owner/shcema/owner.draft.schema";
import { mapBusinessPreview } from "../mappers/business.preview.mapper";

export async function getBusinessPreview(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  /* =====================
     2️⃣ INPUT
  ====================== */
  const configurationId = new URL(request.url)
    .searchParams.get("configurationId");

  if (!configurationId) {
    return json(
      { ok: false, error: "MISSING_CONFIGURATION_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ OWNERSHIP (CONFIG)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as any;

  if (!configuration || configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ LOAD BUSINESS DRAFT
  ====================== */
  const rawDraft = await env.BUSINESS_KV.get(
    `BUSINESS_DRAFT:${configurationId}`
  );

  if (!rawDraft) {
    // preview vuota → flusso valido
    return json(
      {
        ok: true,
        preview: {
          configurationId,
          complete: false,
        },
      },
      request,
      env
    );
  }

  const businessDraft =
    BusinessDraftSchema.parse(JSON.parse(rawDraft));

  /* =====================
     5️⃣ LOAD OWNER DRAFT (OPTIONAL)
  ====================== */
  let ownerDraft;
  const rawOwner = await env.BUSINESS_KV.get(
    `BUSINESS_OWNER_DRAFT:${session.user.id}`
  );

  if (rawOwner) {
    ownerDraft =
      OwnerDraftSchema.parse(JSON.parse(rawOwner));
  }

  /* =====================
     6️⃣ MAP → PREVIEW
  ====================== */
  const preview = mapBusinessPreview(
    businessDraft,
    ownerDraft
  );

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true, preview },
    request,
    env
  );
}

=== FILE: routes/business.reopen-draft.ts
LANG: ts
SIZE:     4276 bytes
----------------------------------------
// ======================================================
// BE || BUSINESS || REOPEN DRAFT (FASE 1)
// POST /api/business/reopen-draft
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Riapre il flusso guidato BUSINESS + OWNER
// - Il controllo di flusso è demandato ESCLUSIVAMENTE ai draft
//
// MODELLO DATI (POST-FASE-1):
// - BusinessDraft è OWNED dalla Configuration
// - ID BusinessDraft === configurationId
// - OwnerDraft è attualmente globale per user
//
// EFFETTI:
// - BusinessDraft.complete → false
// - OwnerDraft.complete → false
//
// NOTA IMPORTANTE:
// - Configuration.status NON governa il flusso
// - Configuration è usata solo per ownership e routing
// ======================================================

import { z } from "zod";
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { BusinessDraftSchema } from "../schema/business.draft.schema";
import { OwnerDraftSchema } from "@domains/owner/shcema/owner.draft.schema";

/* =========================
   INPUT SCHEMA
========================= */
const ReopenBusinessDraftInputSchema = z.object({
  configurationId: z.string().min(1),
});

/* ======================================================
   HANDLER
====================================================== */
export async function reopenBusinessDraft(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  /* =====================
     2️⃣ INPUT
  ====================== */
  let configurationId: string;

  try {
    const body = ReopenBusinessDraftInputSchema.parse(
      await request.json()
    );
    configurationId = body.configurationId;
  } catch {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
     (OWNERSHIP ONLY)
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as any;

  if (!configuration) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  if (configuration.userId !== session.user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ REOPEN BUSINESS DRAFT
     (OWNED BY CONFIGURATION)
  ====================== */
  const rawBusiness = await env.BUSINESS_KV.get(
    `BUSINESS_DRAFT:${configurationId}`
  );

  if (!rawBusiness) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const parsedBusiness = BusinessDraftSchema.safeParse(
    JSON.parse(rawBusiness)
  );

  if (!parsedBusiness.success) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_CORRUPTED" },
      request,
      env,
      500
    );
  }

  await env.BUSINESS_KV.put(
    `BUSINESS_DRAFT:${configurationId}`,
    JSON.stringify({
      ...parsedBusiness.data,
      // forza riapertura del flusso guidato
      complete: false,
      updatedAt: new Date().toISOString(),
    })
  );

  /* =====================
     5️⃣ REOPEN OWNER DRAFT
     (GLOBAL PER USER)
  ====================== */
  // NB:
  // OwnerDraft è attualmente globale per user.
  // Se in futuro diventa per-business, la key va versionata.
  const ownerKey = `BUSINESS_OWNER_DRAFT:${session.user.id}`;
  const rawOwner = await env.BUSINESS_KV.get(ownerKey);

  if (rawOwner) {
    const ownerDraft = OwnerDraftSchema.parse(
      JSON.parse(rawOwner)
    );

    await env.BUSINESS_KV.put(
      ownerKey,
      JSON.stringify({
        ...ownerDraft,
        complete: false,
        updatedAt: new Date().toISOString(),
      })
    );
  }

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json(
    { ok: true },
    request,
    env
  );
}

=== FILE: routes/business.verification.init.ts
LANG: ts
SIZE:     5553 bytes
----------------------------------------
// ======================================================
// BE || BUSINESS || VERIFICATION INIT (FASE 1)
// POST /api/business/verification/init
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Inizializza la fase di VERIFICA del Business
// - Trasforma un BusinessDraft COMPLETO in Business (pending)
//
// MODELLO DI FLUSSO (POST-FASE-1):
// - BusinessDraft.complete === true
// - OwnerDraft.complete === true
// - Nessuna dipendenza da Configuration.status
//
// INVARIANTI:
// - Auth obbligatoria
// - Ownership verificata via Configuration
// - Backend = source of truth
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { BusinessSchema } from "../schema/business.schema";
import { BusinessDraftSchema } from "../schema/business.draft.schema";
import { OwnerDraftSchema } from "@domains/owner/shcema/owner.draft.schema";

/* =========================
   KV KEYS
========================= */
const CONFIGURATION_KEY = (id: string) => `CONFIGURATION:${id}`;
const BUSINESS_DRAFT_KEY = (id: string) => `BUSINESS_DRAFT:${id}`;
const BUSINESS_KEY = (id: string) => `BUSINESS:${id}`;

/* ======================================================
   HANDLER
====================================================== */
export async function initBusinessVerification(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  const userId = session.user.id;

  /* =====================
     2️⃣ INPUT
  ====================== */
  let configurationId: string;

  try {
    const body = (await request.json()) as {
      configurationId?: string;
    };
    configurationId = body.configurationId ?? "";
  } catch {
    return json(
      { ok: false, error: "INVALID_JSON_BODY" },
      request,
      env,
      400
    );
  }

  if (!configurationId) {
    return json(
      { ok: false, error: "MISSING_CONFIGURATION_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
     (OWNERSHIP ONLY)
  ====================== */
  const configRaw = await env.CONFIGURATION_KV.get(
    CONFIGURATION_KEY(configurationId)
  );

  if (!configRaw) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const configuration = JSON.parse(configRaw);

  if (configuration.userId !== userId) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ LOAD BUSINESS DRAFT
     (OWNED BY CONFIGURATION)
  ====================== */
  const draftRaw = await env.BUSINESS_KV.get(
    BUSINESS_DRAFT_KEY(configurationId)
  );

  if (!draftRaw) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const parsedDraft = BusinessDraftSchema.safeParse(
    JSON.parse(draftRaw)
  );

  if (!parsedDraft.success) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_CORRUPTED" },
      request,
      env,
      500
    );
  }

  const businessDraft = parsedDraft.data;

  if (businessDraft.complete !== true) {
    return json(
      { ok: false, error: "BUSINESS_DRAFT_NOT_COMPLETE" },
      request,
      env,
      409
    );
  }

  /* =====================
     5️⃣ LOAD OWNER DRAFT
     (GLOBAL PER USER)
  ====================== */
  const ownerRaw = await env.BUSINESS_KV.get(
    `BUSINESS_OWNER_DRAFT:${userId}`
  );

  if (!ownerRaw) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const parsedOwner = OwnerDraftSchema.safeParse(
    JSON.parse(ownerRaw)
  );

  if (!parsedOwner.success) {
    return json(
      { ok: false, error: "OWNER_DRAFT_CORRUPTED" },
      request,
      env,
      500
    );
  }

  const ownerDraft = parsedOwner.data;

  if (ownerDraft.complete !== true) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_COMPLETE" },
      request,
      env,
      409
    );
  }

  /* =====================
     6️⃣ IDEMPOTENCY CHECK
  ====================== */
  const existing = await env.BUSINESS_KV.get(
    BUSINESS_KEY(configurationId)
  );

  if (existing) {
    return json(
      { ok: true, status: "ALREADY_INITIALIZED" },
      request,
      env
    );
  }

  /* =====================
     7️⃣ CREATE BUSINESS (PENDING)
  ====================== */
  const now = new Date().toISOString();

  const business = BusinessSchema.parse({
    ...businessDraft,

    id: configurationId,
    publicId:
      businessDraft.id ??
      configurationId,

    ownerUserId: userId,
    createdByUserId: userId,
    editorUserIds: [],

    logo: null,
    coverImage: null,
    gallery: [],
    documents: [],

    status: "pending",

    createdAt: now,
    updatedAt: now,
  });

  await env.BUSINESS_KV.put(
    BUSINESS_KEY(business.id),
    JSON.stringify(business)
  );

  /* =====================
     8️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      businessId: business.id,
      status: business.status,
    },
    request,
    env
  );
}

=== FILE: routes/deprecated/business.get.ts
LANG: ts
SIZE:     2096 bytes
----------------------------------------
// ======================================================
// BE || routes/tenant/business/business.get.ts
// ======================================================
//
// GET BUSINESS (TENANT)
// GET /api/business/:id
//
// RUOLO:
// - Ritorna un singolo business dell’utente
// - Hard auth + ownership check
//
// INVARIANTI:
// - user da sessione
// - businessId da URL
// - ownerUserId deve combaciare
// ======================================================

import type { Env } from "../../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { BUSINESS_KEY } from "../../../../lib/kv";
import { BusinessSchema } from "../../schema/business.schema";
import { json } from "../../../auth/route/helper/https";

export async function getBusiness(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1) AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const user = session.user;

  /* =====================
     2) EXTRACT ID
  ====================== */
  const id = request.url.split("/").pop();
  if (!id) {
    return json({ ok: false, error: "MISSING_BUSINESS_ID" }, request, env, 400);
  }

  /* =====================
     3) LOAD BUSINESS
  ====================== */
  const raw = await env.BUSINESS_KV.get(BUSINESS_KEY(id));
  if (!raw) {
    return json({ ok: false, error: "BUSINESS_NOT_FOUND" }, request, env, 404);
  }

  /* =====================
     4) VALIDATE
  ====================== */
  let business;
  try {
    business = BusinessSchema.parse(JSON.parse(raw));
  } catch {
    return json({ ok: false, error: "CORRUPTED_BUSINESS_DATA" }, request, env, 500);
  }

  /* =====================
     5) OWNERSHIP
  ====================== */
  if (business.ownerUserId !== user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  /* =====================
     6) RESPONSE
  ====================== */
  return json({ ok: true, business }, request, env);
}


=== FILE: routes/deprecated/business.list.ts
LANG: ts
SIZE:     1362 bytes
----------------------------------------
// ======================================================
// BE || routes/tenant/business/business.list.ts
// ======================================================
//
// LIST USER BUSINESSES
// GET /api/business
//
// RUOLO:
// - Ritorna la lista dei business dell’utente autenticato
// - Basata su indice KV (no scan, no join)
//
// INVARIANTI:
// - Auth hard (requireAuthUser)
// - Read-only
// - Non carica Business completi
// ======================================================

import type { Env } from "../../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "../../../auth/route/helper/https";

const USER_BUSINESSES_KEY = (userId: string) =>
  `USER_BUSINESSES:${userId}`;

type BusinessSummary = {
  businessId: string;
  publicId: string;
  name: string;
  status: "draft" | "pending" | "active" | "suspended";
  createdAt: string;
};

export async function listBusinesses(
  request: Request,
  env: Env
): Promise<Response> {
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const raw = await env.BUSINESS_KV.get(
    USER_BUSINESSES_KEY(session.user.id),
    "json"
  );

  const items: BusinessSummary[] = Array.isArray(raw)
    ? raw
    : [];

  return json({ ok: true, items }, request, env);
}


=== FILE: routes/deprecated/business.submit.ts
LANG: ts
SIZE:     3370 bytes
----------------------------------------
// backend/src/routes/businessSubmit.ts
/* =====================
   1️⃣ AUTH GUARD (HARD)
======================

AI-SUPERCOMMENT — AUTH INVARIANT

RUOLO:
- Questo endpoint richiede utente autenticato
- La sessione è l’unica fonte di verità

INVARIANTI:
- Se sessione mancante o invalida → 401
- NON usare getUserFromSession come guard

PERCHÉ:
- Evita sessioni fantasma
- Allinea BE e FE
====================== */

import type { Env } from "../../../../types/env";

import { BusinessSchema } from "../../schema/business.schema";
import { logActivity } from "../../../activity/router/logActivity";

import { BUSINESS_KEY } from "../../../../lib/kv";
import { requireAuthUser } from "@domains/auth";
import { json } from "../../../auth/route/helper/https";

/* ======================================================
   SUBMIT BUSINESS
   POST /api/business/submit
   Transizione: draft → pending
====================================================== */
export async function submitBusiness(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);

  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }
  
  const user = session.user;

  /* =====================
     2️⃣ LOOKUP USER → BUSINESS
  ====================== */
  const businessId = await env.BUSINESS_KV.get(
    `USER_BUSINESS:${user.id}`
  );

  if (!businessId) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const raw = await env.BUSINESS_KV.get(
    BUSINESS_KEY(businessId)
  );

  if (!raw) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     3️⃣ VALIDATE DOMAIN
  ====================== */
  let business;
  try {
    business = BusinessSchema.parse(JSON.parse(raw));
  } catch {
    return json(
      { ok: false, error: "CORRUPTED_BUSINESS_DATA" },
      request,
      env,
      500
    );
  }

  /* =====================
     4️⃣ OWNERSHIP CHECK
  ====================== */
  if (business.ownerUserId !== user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     5️⃣ STATE GUARDS
  ====================== */
  if (business.status === "pending") {
    return json(
      {
        ok: true,
        businessId,
        status: "pending",
        alreadySubmitted: true,
      },
      request,
      env
    );
  }


  /* =====================
     6️⃣ STATE TRANSITION
  ====================== */
  const updatedBusiness = {
    ...business,
    status: "pending" as const,
  };

  await env.BUSINESS_KV.put(
    BUSINESS_KEY(businessId),
    JSON.stringify(updatedBusiness)
  );

  /* =====================
     7️⃣ AUDIT LOG
  ====================== */
  await logActivity(env, "BUSINESS_SUBMITTED", user.id, {
    businessId,
    name: business.name,
    submittedAt: new Date().toISOString(),
  });

  /* =====================
     8️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      businessId,
      status: "pending",
    },
    request,
    env
  );
}


=== FILE: routes/deprecated/configuration.product.write.ts
LANG: ts
SIZE:     5217 bytes
----------------------------------------
// ======================================================
// BE || POST /api/configuration/from-cart
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION CREATION (CANONICAL)
//
// RUOLO:
// - Punto di ingresso UNICO dal frontend (ProductCard)
// - Crea una Configuration "draft" deterministica
// - NON dipende dal Cart (il Cart è solo un pointer)
// - È idempotente per businessName + solutionId
//
// SOURCE OF TRUTH:
// - SolutionSchema
// - ProductSchema
// - OptionSchema
// - ConfigurationSchema
//
// INVARIANTI (NON NEGOZIABILI):
// 1. ConfigurationId è deterministico (slug)
// 2. Se esiste già → viene riutilizzato
// 3. Nessuna logica di checkout
// 4. Nessuna creazione Business definitiva
// 5. Tutti i dati FE finiscono in `configuration.data`
//
// FLOW:
// ProductCard
//   → POST /configuration/from-cart
//   → CONFIGURATION_KV
//   → redirect /user/configurator/:id
//
// ======================================================

import { z } from "zod";
import type { Env } from "../../../../types/env.js";

import { requireAuthUser } from "@domains/auth";

import { SolutionSchema } from "../../../solution/schema/solution.schema.js";
import { ProductSchema } from "../../../product/product.schema.js";
import { OptionSchema } from "../../../option/option.schema.ts.js";

import {
  ConfigurationSchema,
  configurationKey,
  userConfigurationsKey,
  buildConfigurationId,
} from "../../../configuration/index.js";

/* =========================
   INPUT VALIDATION
========================= */
const InputSchema = z.object({
  businessName: z.string().min(2),
  solutionId: z.string().min(1),
  productId: z.string().min(1),
  optionIds: z.array(z.string()).default([]),
});

/* =========================
   HANDLER
========================= */
export async function createConfigurationFromCart(
  req: Request,
  env: Env
) {
  /* =========================
     AUTH — REQUIRED
  ========================= */
  const auth = await requireAuthUser(req, env);
  if (!auth) {
    return Response.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const { userId } = auth;

  /* =========================
     PARSE INPUT
  ========================= */
  const body = InputSchema.parse(await req.json());

  /* =========================
     LOAD SOLUTION
  ========================= */
  const rawSolution = await env.SOLUTIONS_KV.get(
    `SOLUTION:${body.solutionId}`
  );

  if (!rawSolution) {
    return Response.json(
      { ok: false, error: "SOLUTION_NOT_FOUND" },
      { status: 404 }
    );
  }

  const solution = SolutionSchema.parse(
    JSON.parse(rawSolution)
  );

  /* =========================
     LOAD PRODUCT
  ========================= */
  const rawProduct = await env.PRODUCTS_KV.get(
    `PRODUCT:${body.productId}`
  );

  if (!rawProduct) {
    return Response.json(
      { ok: false, error: "PRODUCT_NOT_FOUND" },
      { status: 404 }
    );
  }

  const product = ProductSchema.parse(
    JSON.parse(rawProduct)
  );

  /* =========================
     LOAD OPTIONS (SNAPSHOT)
     - tollerante: opzioni mancanti vengono ignorate
  ========================= */
  const options = [];

  for (const optId of body.optionIds) {
    const rawOpt = await env.OPTIONS_KV.get(
      `OPTION:${optId}`
    );
    if (!rawOpt) continue;

    options.push(
      OptionSchema.parse(JSON.parse(rawOpt))
    );
  }

  /* =========================
     BUILD CONFIGURATION ID
     (DETERMINISTIC)
  ========================= */
  const configurationId = buildConfigurationId(
    body.businessName,
    solution.id
  );

  const key = configurationKey(configurationId);

  /* =========================
     IDEMPOTENCY CHECK
  ========================= */
  const existing = await env.CONFIGURATION_KV.get(key);
  if (existing) {
    return Response.json({
      ok: true,
      configurationId,
      reused: true,
    });
  }

  /* =========================
     BUILD CONFIGURATION (DRAFT)
  ========================= */
  const now = new Date().toISOString();

  const configuration = ConfigurationSchema.parse({
    id: configurationId,
    userId,

    solutionId: solution.id,
    productId: product.id,
    options: body.optionIds,

    data: {
      solution,
      product,
      options,

      business: {
        name: body.businessName,
        sector: solution.industries?.[0] ?? "",
        city: "",
        email: "",
      },

      setup: {},
      ai: { status: "pending" },
    },

    status: "draft",
    createdAt: now,
    updatedAt: now,
  });

  /* =========================
     PERSISTENCE
  ========================= */
  await env.CONFIGURATION_KV.put(
    key,
    JSON.stringify(configuration)
  );

  const userKey = userConfigurationsKey(userId);
  const list = JSON.parse(
    (await env.CONFIGURATION_KV.get(userKey)) ?? "[]"
  );

  if (!list.includes(configurationId)) {
    await env.CONFIGURATION_KV.put(
      userKey,
      JSON.stringify([...list, configurationId])
    );
  }

  /* =========================
     RESPONSE
  ========================= */
  return Response.json({
    ok: true,
    configurationId,
    reused: false,
  });
}


=== FILE: routes/deprecated/uploadMenu.ts
LANG: ts
SIZE:     3868 bytes
----------------------------------------
// backend/src/routes/uploadBusinessMenu.ts
/* =====================
   1️⃣ AUTH GUARD (HARD)
======================

AI-SUPERCOMMENT — AUTH INVARIANT

RUOLO:
- Questo endpoint richiede utente autenticato
- La sessione è l’unica fonte di verità

INVARIANTI:
- Se sessione mancante o invalida → 401
- NON usare getUserFromSession come guard

PERCHÉ:
- Evita sessioni fantasma
- Allinea BE e FE
====================== */

import type { Env } from "../../../../types/env";

import { BusinessSchema } from "../../schema/business.schema";
import { BUSINESS_KEY } from "../../../../lib/kv";

import { requireAuthUser } from "@domains/auth";
import { json } from "../../../auth/route/helper/https";

/* ======================================================
   UPLOAD BUSINESS MENU (PDF)
   POST /api/business/menu/upload?businessId=UUID
====================================================== */
export async function uploadBusinessMenu(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
 
const session = await requireAuthUser(request, env);

if (!session) {
  return json(
    { ok: false, error: "UNAUTHORIZED" },
    request,
    env,
    401
  );
}

const user = session.user;

  /* =====================
     2️⃣ EXTRACT PARAM
  ====================== */
  const url = new URL(request.url);
  const businessId = url.searchParams.get("businessId");

  if (!businessId) {
    return json(
      { ok: false, error: "MISSING_BUSINESS_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD BUSINESS
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    BUSINESS_KEY(businessId)
  );

  if (!raw) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     4️⃣ VALIDATE DOMAIN
  ====================== */
  let business;
  try {
    business = BusinessSchema.parse(JSON.parse(raw));
  } catch {
    return json(
      { ok: false, error: "CORRUPTED_BUSINESS_DATA" },
      request,
      env,
      500
    );
  }

  /* =====================
     5️⃣ OWNERSHIP CHECK
  ====================== */
  if (business.ownerUserId !== user.id) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     6️⃣ PARSE FORM DATA
  ====================== */
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(
      { ok: false, error: "INVALID_FORM_DATA" },
      request,
      env,
      400
    );
  }

  const file = form.get("file");

  if (!(file instanceof File)) {
    return json(
      { ok: false, error: "MISSING_PDF_FILE" },
      request,
      env,
      400
    );
  }

  if (file.type !== "application/pdf") {
    return json(
      { ok: false, error: "ONLY_PDF_ALLOWED" },
      request,
      env,
      400
    );
  }

  /* =====================
     7️⃣ UPLOAD (DETERMINISTIC KEY)
  ====================== */
  const key = `menu-${businessId}.pdf`;

  await env.BUSINESS_MENU_BUCKET.put(
    key,
    file.stream(),
    {
      httpMetadata: {
        contentType: "application/pdf",
      },
    }
  );

  const menuPdfUrl = `${env.R2_PUBLIC_BASE_URL}/${key}`;

  /* =====================
     8️⃣ UPDATE BUSINESS
     (menu upload ⇒ pending)
  ====================== */
  const updatedBusiness = {
    ...business,
    menuPdfUrl,
    status: "pending",
  };

  await env.BUSINESS_KV.put(
    BUSINESS_KEY(businessId),
    JSON.stringify(updatedBusiness)
  );

  /* =====================
     9️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      businessId,
      menuPdfUrl,
      status: "pending",
    },
    request,
    env
  );
}


=== FILE: routes/index.ts
LANG: ts
SIZE:     1048 bytes
----------------------------------------
// ======================================================
// DOMAIN || BUSINESS || ROUTES INDEX
// ======================================================
//
// RUOLO:
// - Barrel unico per tutte le route business
// - Usato dal router principale
//
// NOTA:
// - SOLO route attive (no legacy)
// ======================================================

export { listAllBusinessDrafts } from "./business.draft.list-get";

export { UpdateBusinessDraftSchema } from "../schema/business.update-draft.schema";
export { createBusinessDraft } from "./business.create-draft";
export { getBusinessDraft } from "./business.get.base-draft";

// ⚠️ FUTURE (quando riattivate):

export { getBusiness } from "./deprecated/business.get";
export { listBusinesses } from "./deprecated/business.list";
export { submitBusiness } from "./deprecated/business.submit";
export { uploadBusinessMenu } from "./deprecated/uploadMenu";

export { reopenBusinessDraft } from "./business.reopen-draft";
export { initBusinessVerification } from "./business.verification.init";

=== FILE: schema/business.create-draft.schema.ts
LANG: ts
SIZE:      872 bytes
----------------------------------------
import { z } from "zod";
import { OpeningHoursSchema } from "@domains/GeneralSchema/hours.opening.schema";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";
export const CreateBusinessDraftSchema = z.object({
  configurationId: z.string(),
  solutionId: z.string(),
  productId: z.string(),

  businessName: z.string().min(1),

  openingHours: OpeningHoursSchema,

  contact: ContactSchema.refine(
    (c) => !!c.mail,
    { message: "MAIL_REQUIRED_FOR_BUSINESS" }
  ),

  // ZIP PUÒ ESSERE VUOTO → OK
  address: AddressSchema.optional(),

  businessDescriptionTags: z.array(z.string()).optional(),
  businessServiceTags: z.array(z.string()).optional(),

  privacy: z.object({
    accepted: z.literal(true),
    acceptedAt: z.string(),
    policyVersion: z.string(),
  }),
});


=== FILE: schema/business.document.schema.ts
LANG: ts
SIZE:     1321 bytes
----------------------------------------
import { z } from "zod";

/* ======================================================
 * BUSINESS DOCUMENT (VERIFICA)
 * ====================================================== */
export const BusinessDocumentSchema = z.object({
  /* =========================
     TIPO
  ========================= */
  type: z.enum([
    "business_register",   // visura camerale
    "vat_certificate",     // certificato P.IVA
    "business_license",    // licenza / SCIA
    "other",
  ]),

  /* =========================
     FORMATO
  ========================= */
  format: z.enum(["pdf", "img"]),

  /* =========================
     STORAGE
  ========================= */
  objectKey: z.string(),           // R2 key (source of truth)
  publicUrl: z.string().url().optional(), // solo se pubblico

  checksum: z.string().optional(),
  size: z.number().int().positive().optional(),

  /* =========================
     VERIFICA
  ========================= */
  verificationStatus: z
    .enum(["pending", "approved", "rejected"])
    .default("pending"),

  verifiedAt: z.string().datetime().optional(),

  /* =========================
     AUDIT
  ========================= */
  uploadedAt: z.string().datetime(),
  uploadedByUserId: z.string().uuid(),
});

export type BusinessDocumentDTO =
  z.infer<typeof BusinessDocumentSchema>;


=== FILE: schema/business.draft.schema.ts
LANG: ts
SIZE:     1165 bytes
----------------------------------------
//be/..../business.draft.schema.ts


import { z } from "zod";
import { OpeningHoursSchema } from "@domains/GeneralSchema/hours.opening.schema";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";

export const BusinessDraftSchema = z.object({
  /* Identity */
  id: z.string().min(1),
  configurationId: z.string().min(1),
  userId: z.string(),

  /* Core */
  businessName: z.string().min(1),

  /* Commercial */
  solutionId: z.string().min(1),
  productId: z.string().min(1),

  /* Domain */
  openingHours: OpeningHoursSchema,

  /* ✅ CONTACT & ADDRESS (NEW CANONICAL) */
  contact: ContactSchema,
  address: AddressSchema.optional(),

  /* Classification */
  businessDescriptionTags: z.array(z.string()).default([]),
  businessServiceTags: z.array(z.string()).default([]),

  /* Privacy */
  privacy: z.object({
    accepted: z.boolean(),
    acceptedAt: z.string(),
    policyVersion: z.string(),
  }),

  /* Status */
  verified: z.literal(false),
  complete: z.boolean().default(false),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});


=== FILE: schema/business.schema.ts
LANG: ts
SIZE:     1410 bytes
----------------------------------------
import { z } from "zod";
import { BusinessDraftSchema } from "./business.draft.schema";
import { BusinessDocumentSchema } from "./business.document.schema";
import { LogoSchema } from "./logo.schema";
import { GalleryImageSchema } from "./gallery.schema";

/* ======================================================
 * BUSINESS (FINAL ENTITY)
 * ====================================================== */
export const BusinessSchema = BusinessDraftSchema.extend({
  /* =========================
     IDENTITY (FINAL)
  ========================= */
  id: z.string().uuid(),            // rafforzato
  publicId: z.string().min(3),

  ownerUserId: z.string().uuid(),
  createdByUserId: z.string().uuid(),

  editorUserIds: z.array(z.string().uuid()).default([]),

  /* =========================
     DOCUMENTI LEGALI
  ========================= */
  documents: z.array(BusinessDocumentSchema).default([]),

  /* =========================
     MEDIA
  ========================= */
  logo: LogoSchema.nullable(),
  coverImage: GalleryImageSchema.nullable(),
  gallery: z.array(GalleryImageSchema).max(12).default([]),

  /* =========================
     STATUS (REALE)
  ========================= */
  status: z.enum([
    "pending",     // creato ma non verificato
    "verified",    // documenti approvati
    "active",      // operativo
    "suspended",
  ]),

  verifiedAt: z.string().datetime().optional(),
});


=== FILE: schema/business.update-draft.schema.ts
LANG: ts
SIZE:     1738 bytes
----------------------------------------
// ======================================================
// DOMAIN || BUSINESS || UPDATE DRAFT.schema.ts
// ======================================================
//
// RUOLO:
// - Input canonico per UPDATE BusinessDraft
// - Usato da POST /api/business/update-draft
//
// INVARIANTI:
// - Tutti i campi opzionali (PATCH-like)
// - verified NON modificabile
// - commercial origin NON modificabile
// DEPRECATO 
// ======================================================
// ======================================================
// DOMAIN || BUSINESS || UPDATE DRAFT.schema.ts
// ======================================================
//
// RUOLO:
// - Input canonico per UPDATE BusinessDraft (PATCH-like)
// - Usato da POST /api/business/update-draft
//
// INVARIANTI:
// - Tutti i campi opzionali
// - Nessun vincolo di business finale
// - verified NON modificabile
// - commercial origin NON modificabile
// ======================================================

import { z } from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";
import { OpeningHoursSchema } from "@domains/GeneralSchema/hours.opening.schema";

export const UpdateBusinessDraftSchema = z.object({
  /* Identity */
  businessDraftId: z.string(),

  /* Core */
  businessName: z.string().optional(),

  /* Domain */
  openingHours: OpeningHoursSchema.optional(),

  /* ✅ CONTACT (canonical, permissivo) */
  contact: ContactSchema.optional(),

  /* ✅ ADDRESS (separato, opzionale) */
  address: AddressSchema.optional(),

  /* Classification */
  businessDescriptionTags: z.array(z.string()).optional(),
  businessServiceTags: z.array(z.string()).optional(),
});


=== FILE: schema/cover.schema.ts
LANG: ts
SIZE:      164 bytes
----------------------------------------
import {z} from "zod" ;

export const CoverSchema = z.object({
    objectKey: z.string(),
    url: z.string().url(),
    uploadedAt: z.string().datetime(),
  });
  

=== FILE: schema/gallery.schema.ts
LANG: ts
SIZE:      210 bytes
----------------------------------------
import {z} from "zod" ;




export const GalleryImageSchema = z.object({
    objectKey: z.string(),
    url: z.string().url(),
    order: z.number().int().min(0),
    uploadedAt: z.string().datetime(),
  });
  

=== FILE: schema/logo.schema.ts
LANG: ts
SIZE:      163 bytes
----------------------------------------
import {z} from "zod" ;

export const LogoSchema = z.object({
    objectKey: z.string(),
    url: z.string().url(),
    uploadedAt: z.string().datetime(),
  });
  

francescomaggi@MacBook-Pro business % 