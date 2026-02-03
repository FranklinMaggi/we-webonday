francescomaggi@MacBook-Pro domains % cd '/Users/francescomaggi/Documents/GitHub/We-WebOnDay/backend/src/domains/configuration'
francescomaggi@MacBook-Pro configuration % aidump
AI_DUMP_V1
ROOT: /Users/francescomaggi/Documents/GitHub/We-WebOnDay/backend/src/domains/configuration
DATE: 2026-01-31T11:12:35Z
INCLUDE_EXT: js,ts,css,tsx,html,json,toml
EXCLUDE_DIRS: .wrangler,node_modules,dist,build,coverage,.next,.cache,.git,frontend/public

=== FILE: DataTransferObgject/configuration.dto.ts
LANG: ts
SIZE:      239 bytes
----------------------------------------
/**Output API */

/**
 * Output API per FE
 * - mai identico allo schema interno
 */
export type ConfigurationPublicDTO = {
    id: string;
    status: string;
    solutionId: string;
    productId: string;
    businessId?: string;
  };
  

=== FILE: DataTransferObgject/inputDaUser/configuration.status.transition.dto.ts
LANG: ts
SIZE:      655 bytes
----------------------------------------
// ======================================================
// BE || ConfigurationStatusTransitionDto
// ======================================================
//
// RUOLO:
// - Cambia stato Configuration
// - Validazioni lato BE
// ======================================================

import { z } from "zod";
import { CONFIGURATION_STATUS } from "@domains/configuration/schema/configuration.schema";

export const ConfigurationStatusTransitionSchema = z.object({
  configurationId: z.string().min(1),
  nextStatus: z.enum(CONFIGURATION_STATUS),
});

export type ConfigurationStatusTransitionDto =
  z.infer<typeof ConfigurationStatusTransitionSchema>;


=== FILE: DataTransferObgject/inputDaUser/configuration.workspace.write.dto.ts
LANG: ts
SIZE:      664 bytes
----------------------------------------
// ======================================================
// BE || ConfigurationWorkspaceWriteDto
// ======================================================
//
// RUOLO:
// - Aggiorna workspace UI-driven
// - NON cambia stato commerciale
// ======================================================

import { z } from "zod";

export const ConfigurationWorkspaceWriteSchema = z.object({
  configurationId: z.string().min(1),

  data: z.object({
    layoutId: z.string().optional(),
    themeId: z.string().optional(),
    lastPreviewAt: z.string().optional(),
  }),
});

export type ConfigurationWorkspaceWriteDto =
  z.infer<typeof ConfigurationWorkspaceWriteSchema>;


=== FILE: DataTransferObgject/output/configuration.base.read.dto.ts
LANG: ts
SIZE:      616 bytes
----------------------------------------
// ======================================================
// BE || ConfigurationBaseReadDTO
// ======================================================
//
// RUOLO:
// - Output minimo per Dashboard / Configurator start
// - Usato subito dopo il login
//
// INVARIANTI:
// - Read only
// - Nessun dato sensibile
// ======================================================

export type ConfigurationBaseReadDTO = {
    id: string;
    status: "DRAFT" | "CONFIGURATION_IN_PROGRESS";
    solutionId: string;
    productId: string;
    businessName?: string;  // da prefill
    businessDraftId?: string | null;
  
  };
  

  

=== FILE: DataTransferObgject/output/configuration.business.write.dto.ts
LANG: ts
SIZE:      613 bytes
----------------------------------------
// ======================================================
// BE || ConfigurationBusinessWriteDto
// ======================================================
//
// RUOLO:
// - Scrittura STEP BUSINESS
// - Collega Business reale
//
// INVARIANTI:
// - Policy già accettata
// - Business già creato
// ======================================================

import { z } from "zod";

export const ConfigurationBusinessWriteSchema = z.object({
  configurationId: z.string().min(1),

  businessId: z.string().min(1),
});

export type ConfigurationBusinessWriteDto =
  z.infer<typeof ConfigurationBusinessWriteSchema>;


=== FILE: configuration.factory.ts
LANG: ts
SIZE:      624 bytes
----------------------------------------
/**buildConfigurationId, slugify */


/* =========================
   ID HELPERS (DETERMINISTICO)
========================= */
export function slugify(input: string): string {
    return input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }


/**
 * ConfigurationId deterministico
 * pattern: {businessSlug}:{solutionId}
 * es: pizzeria-da-mario:website-basic
 */
export function buildConfigurationId(businessName: string, solutionId: string) {
    return `${slugify(businessName)}:${slugify(solutionId)}`;
  }
  

  

=== FILE: configuration.keys.ts
LANG: ts
SIZE:      696 bytes
----------------------------------------
/** configuration Key , userConfigurations Key */

import { Env } from "../../types/env";

import { ConfigurationDTO } from "./schema/configuration.schema";
/* =========================
   KV KEYS
========================= */
export function configurationKey(id: string) {
    return `CONFIGURATION:${id}`;
  }
  
  export function userConfigurationsKey(userId: string) {
    return `USER_CONFIGURATIONS:${userId}`;
  }
  
  /* =========================
   HELPERS
========================= */
export async function getConfiguration(env: Env, id: string) {
    const raw = await env.CONFIGURATION_KV.get(configurationKey(id));
    return raw ? (JSON.parse(raw) as ConfigurationDTO) : null;
  }
  

=== FILE: index.ts
LANG: ts
SIZE:     2497 bytes
----------------------------------------
// ======================================================
// BE || domains/configuration/index.ts
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION DOMAIN BARREL (CANONICAL)
//
// RUOLO:
// - Punto di export unico del dominio Configuration
// - Evita import frammentati nei routes
//
// INVARIANTE:
// - ❌ NO logica runtime
// - ✅ SOLO re-export
// ======================================================

/* ======================================================
   SCHEMA + TYPES
====================================================== */
export {
  CONFIGURATION_STATUS,
  ConfigurationSchema,
} from "./schema/configuration.schema";

export type {
  ConfigurationStatus,
  ConfigurationDTO,
} from "./schema/configuration.schema";

/* ======================================================
   KV KEYS + READ HELPERS
====================================================== */
export {
  configurationKey,
  userConfigurationsKey,
  getConfiguration,
} from "./configuration.keys";

/* ======================================================
   FACTORY / ID
====================================================== */
export {
  slugify,
  buildConfigurationId,
} from "./configuration.factory";

/* ======================================================
   DTO (FE OUTPUT)
====================================================== */
export type {
  ConfigurationPublicDTO,
} from "./DataTransferObgject/configuration.dto";

/* ======================================================
   ROUTES — USER
====================================================== */
export {
  listUserConfigurations,
  getUserConfiguration,
} from "./routes/configuration.read";

export {
  deleteUserConfiguration,
} from "./routes/configuration.user.delete";

/* ======================================================
   ROUTES — BASE (BOOTSTRAP)
====================================================== */
export {
  createConfigurationBase,
} from "./routes/configuration.base.write";

/* ======================================================
   ROUTES — BUSINESS ↔ CONFIGURATION BRIDGE
====================================================== */
export {
  upsertConfigurationFromBusiness,
} from "./routes/deprecated /configuration.business.write";

/* ======================================================
   ROUTES — ADMIN
====================================================== */
export {
  listAllConfigurations,
} from "./routes/configuration.admin.read";


=== FILE: mappers/configuration.draft.mapper.ts
LANG: ts
SIZE:      703 bytes
----------------------------------------
import type { ConfigurationDTO } from "../schema/configuration.schema";
import type { ConfigurationBaseReadDTO } from
  "../DataTransferObgject/output/configuration.base.read.dto";

export function toBaseReadDTO(
  config: ConfigurationDTO
): ConfigurationBaseReadDTO {
  if (config.status !== "DRAFT" && config.status !== "CONFIGURATION_IN_PROGRESS") {
    throw new Error(
      `INVALID_CONFIGURATION_STATE_FOR_BASE_READ: ${config.status}`
    );
  }

  return {
    id: config.id!,
    status: config.status, // ora è SAFE
    solutionId: config.solutionId,
    productId: config.productId,
    businessName: config.prefill?.businessName,
    businessDraftId:config.businessDraftId ?? null,
  };
}


=== FILE: mappers/configuration.status.ts
LANG: ts
SIZE:     3817 bytes
----------------------------------------
// ======================================================
// BE || DOMAIN || CONFIGURATION || STATUS (CANONICAL)
// File: src/domains/configuration/configuration.status.ts
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Source of Truth assoluta per lo stato di Configuration
// - Definisce:
//   • stati possibili
//   • semantica funzionale (capabilities)
//
// NON FA:
// - NON legge KV
// - NON conosce HTTP
// - NON conosce FE
//
// USATO DA:
// - routes/configuration
// - routes/admin/configuration
// - commitConfiguration
// - FE (indirettamente, via DTO)
//
// REGOLA D’ORO:
// - Ogni nuovo status si aggiunge SOLO qui
// ======================================================

/* ======================================================
   STATUS CANONICI (NON ROMPONO GLI ESISTENTI)
====================================================== */

export const CONFIGURATION_STATUS = [
    "CONFIGURATION_IN_PROGRESS",
    "CONFIGURATION_READY",
    "ACCEPTED",
    "REJECTED",
    "BUSINESS_READY",
  ] as const;
  
  export type ConfigurationStatus =
    typeof CONFIGURATION_STATUS[number];
  
  /* ======================================================
     CAPABILITIES (SEMANTICA, NON UI)
  ====================================================== */
  
  export type ConfigurationCapabilities = {
    /** può essere modificata dal configuratore */
    canEdit: boolean;
  
    /** configuratore accessibile */
    canOpenConfigurator: boolean;
  
    /** l’utente può inviarla (submit) */
    canSubmit: boolean;
  
    /** preview disponibile */
    canPreview: boolean;
  
    /** business generabile o già esistente */
    canHaveBusiness: boolean;
  
    /** visibile nella dashboard utente */
    visibleInUserDashboard: boolean;
  
    /** visibile come business */
    visibleAsBusiness: boolean;
  };
  
  /* ======================================================
     MAPPA STATUS → CAPABILITIES (SACRA)
  ====================================================== */
  
  export const CONFIGURATION_CAPABILITIES: Record<
    ConfigurationStatus,
    ConfigurationCapabilities
  > = {
    CONFIGURATION_IN_PROGRESS: {
      canEdit: true,
      canOpenConfigurator: true,
      canSubmit: true,
      canPreview: false,
      canHaveBusiness: false,
      visibleInUserDashboard: true,
      visibleAsBusiness: false,
    },
  
    CONFIGURATION_READY: {
      canEdit: false,
      canOpenConfigurator: false,
      canSubmit: false,
      canPreview: true,
      canHaveBusiness: false,
      visibleInUserDashboard: true,
      visibleAsBusiness: false,
    },
  
    ACCEPTED: {
      canEdit: false,
      canOpenConfigurator: false,
      canSubmit: false,
      canPreview: true,
      canHaveBusiness: true,
      visibleInUserDashboard: true,
      visibleAsBusiness: false,
    },
  
    REJECTED: {
      canEdit: false,
      canOpenConfigurator: false,
      canSubmit: false,
      canPreview: true,
      canHaveBusiness: false,
      visibleInUserDashboard: true,
      visibleAsBusiness: false,
    },
  
    BUSINESS_READY: {
      canEdit: false,
      canOpenConfigurator: false,
      canSubmit: false,
      canPreview: true,
      canHaveBusiness: true,
      visibleInUserDashboard: true,
      visibleAsBusiness: true,
    },
  };
  
  /* ======================================================
     HELPERS (ANTI-IF)
  ====================================================== */
  
  export function getConfigurationCapabilities(
    status: ConfigurationStatus
  ): ConfigurationCapabilities {
    return CONFIGURATION_CAPABILITIES[status];
  }
  
  export function isBusinessVisibleFromConfiguration(
    status: ConfigurationStatus
  ): boolean {
    return CONFIGURATION_CAPABILITIES[status].visibleAsBusiness;
  }

=== FILE: routes/configuration.admin.read copy.ts
LANG: ts
SIZE:     1428 bytes
----------------------------------------
// ======================================================
// BE || routes/configuration/configuration.admin.ts
// ======================================================
//
// CONFIGURATION — ADMIN
//
// RUOLO:
// - Visualizzazione configurazioni (globale)
//
// ENDPOINT:
// - GET /api/admin/configuration
//
// INVARIANTI:
// - Solo admin
// - Read only
// - CONFIGURATION_KV = source of truth
// ======================================================

import type { Env } from "../../../types/env";
import { requireAdmin } from "../../auth/route/admin/guard/admin.guard";
import { configurationKey } from "../../configuration";
import { json } from "../../auth/route/helper/https";
/* ======================================================
   GET /api/admin/configuration
   LIST ALL CONFIGURATIONS
====================================================== */
export async function listAllConfigurations(
  request: Request,
  env: Env
) {
  const admin = await requireAdmin(request, env);
  if (!admin) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  const { keys } = await env.CONFIGURATION_KV.list({
    prefix: "CONFIGURATION:",
  });

  const items = await Promise.all(
    keys.map((k) =>
      env.CONFIGURATION_KV.get(k.name, "json")
    )
  );

  return json(
    {
      ok: true,
      items: items.filter(Boolean),
    },
    request,
    env
  );
}


=== FILE: routes/configuration.admin.read.ts
LANG: ts
SIZE:     1411 bytes
----------------------------------------
// ======================================================
// BE || routes/configuration/configuration.admin.ts
// ======================================================
//
// CONFIGURATION — ADMIN
//
// RUOLO:
// - Visualizzazione configurazioni (globale)
//
// ENDPOINT:
// - GET /api/admin/configuration
//
// INVARIANTI:
// - Solo admin
// - Read only
// - CONFIGURATION_KV = source of truth
// ======================================================

import type { Env } from "../../../types/env";
import { requireAdmin } from "../../auth/route/admin/guard/admin.guard";
import { configurationKey } from "..";
import { json } from "../../auth/route/helper/https";
/* ======================================================
   GET /api/admin/configuration
   LIST ALL CONFIGURATIONS
====================================================== */
export async function listAllConfigurations(
  request: Request,
  env: Env
) {
  const admin = await requireAdmin(request, env);
  if (!admin) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  const { keys } = await env.CONFIGURATION_KV.list({
    prefix: "CONFIGURATION:",
  });

  const items = await Promise.all(
    keys.map((k) =>
      env.CONFIGURATION_KV.get(k.name, "json")
    )
  );

  return json(
    {
      ok: true,
      items: items.filter(Boolean),
    },
    request,
    env
  );
}


=== FILE: routes/configuration.attach-owner.ipnut.ts
LANG: ts
SIZE:     3955 bytes
----------------------------------------
// ======================================================
// BE || CONFIGURATION || ATTACH OWNER
// POST /api/business/configuration/attach-owner
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

// ======================================================
// DOMAIN || CONFIGURATION || ATTACH OWNER || INPUT
// ======================================================

export interface AttachOwnerToConfigurationInputDTO {
    configurationId: string;
  }
  
// ======================================================
// KV HELPERS
// ======================================================
const OWNER_DRAFT_KEY = (userId: string) =>
  `BUSINESS_OWNER_DRAFT:${userId}`;

const BUSINESS_DRAFT_KEY = (businessDraftId: string) =>
  `BUSINESS_DRAFT:${businessDraftId}`;

const CONFIGURATION_KEY = (configurationId: string) =>
  `CONFIGURATION:${configurationId}`;

// ======================================================
// HANDLER
// ======================================================
export async function attachOwnerToConfiguration(
  request: Request,
  env: Env
): Promise<Response> {

  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const userId = session.user.id;

  /* =====================
     2️⃣ INPUT
  ====================== */
  const input =
    (await request.json()) as AttachOwnerToConfigurationInputDTO;

  if (!input?.configurationId) {
    return json(
      { ok: false, error: "MISSING_CONFIGURATION_ID" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD CONFIGURATION
  ====================== */
  const configRaw = await env.CONFIGURATION_KV.get(
    CONFIGURATION_KEY(input.configurationId)
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
     4️⃣ LOAD OWNER DRAFT
  ====================== */
  const ownerRaw = await env.BUSINESS_KV.get(
    OWNER_DRAFT_KEY(userId)
  );

  if (!ownerRaw) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const ownerDraft = JSON.parse(ownerRaw);

  if (!ownerDraft.complete) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_COMPLETE" },
      request,
      env,
      409
    );
  }

/* =====================
   5️⃣ ATTACH OWNER (IDEMPOTENT WRITE)
   PERCHÉ:
   - collega definitivamente OwnerDraft alla Configuration
   - sblocca upload documenti owner
   - NON crea ancora l'entità Owner
====================== */
const now = new Date().toISOString();

const updatedConfiguration = {
  ...configuration,

  // 🔐 owner definitivo (idempotente)
  ownerUserId: configuration.ownerUserId ?? userId,

  // 🔑 FONDAMENTALE: serve per upload documenti owner
  ownerDraftId: configuration.ownerDraftId ?? ownerDraft.id,

  // stato coerente con flusso verifica
  status: "CONFIGURATION_IN_PROGRESS",

  updatedAt: now,
};

await env.CONFIGURATION_KV.put(
  CONFIGURATION_KEY(configuration.id),
  JSON.stringify(updatedConfiguration),
  {
    metadata: {
      ...configuration.metadata,
      ownerAttachedAt:
        configuration.metadata?.ownerAttachedAt ?? now,
    },
  }
);


/* =====================
   6️⃣ RESPONSE
====================== */
return json(
  {
    ok: true,
    configurationId: configuration.id,
    status: updatedConfiguration.status,
  },
  request,
  env
);
}

=== FILE: routes/configuration.base.commit.ts
LANG: ts
SIZE:     4590 bytes
----------------------------------------
// ======================================================
// BE || CONFIGURATION — COMMIT
// ======================================================
//
// RUOLO:
// - Finalizza una Configuration
// - Transizione verso stato ACCEPTED
//
// INVARIANTI:
// - Auth obbligatoria
// - Configuration = source of truth
// - BusinessDraft deve esistere
// - Operazione IDEMPOTENTE
//
// FLOW:
// Configurator → Commit → Business visibile in Dashboard
// ======================================================
//@deprecated - not used 
import type { Env } from "../../../types/env";
import type { ConfigurationDTO } from "../schema/configuration.schema";
import { OwnerSchema } from "@domains/owner/shcema/verified-owner.schema";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

// =========================
// KV HELPERS
// =========================
const configurationKey = (id: string) =>
  `CONFIGURATION:${id}`;

const userCommitKey = (id: string) =>
  `USER_COMMIT:${id}`;

const userLastCommitKey = (userId: string) =>
  `USER:${userId}:LAST_COMMIT`;

// ======================================================
// DOMAIN FUNCTION
// ======================================================
export async function commitConfiguration(
  env: Env,
  configurationId: string,
  userId: string
): Promise<{ ok: true }> {
  // =========================
  // LOAD CONFIGURATION
  // =========================
  const configuration =
    (await env.CONFIGURATION_KV.get(
      configurationKey(configurationId),
      "json"
    )) as ConfigurationDTO | null;

  if (!configuration) {
    throw new Error("CONFIGURATION_NOT_FOUND");
  }

  if (configuration.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  // =========================
  // STATE GUARD
  // =========================
  if (
    configuration.status !== "BUSINESS_READY" &&
    configuration.status !== "CONFIGURATION_READY" &&
    configuration.status !== "ACCEPTED"
  ) {
    throw new Error("INVALID_STATE_FOR_COMMIT");
  }

  // =========================
  // GUARD — IDEMPOTENZA
  // =========================
  if (configuration.status === "ACCEPTED") {
    return { ok: true };
  }

  if (!configuration.businessDraftId) {
    throw new Error("BUSINESS_DRAFT_ID_MISSING");
  }

  // =========================
  // PROMOTE CONFIGURATION
  // =========================
  const now = new Date().toISOString();

  const updated: ConfigurationDTO = {
    ...configuration,
    status: "ACCEPTED",
    updatedAt: now,
  };

  await env.CONFIGURATION_KV.put(
    configurationKey(configurationId),
    JSON.stringify(updated)
  );

  // =========================
  // USER COMMIT (AUDIT)
  // =========================
  const commitId = crypto.randomUUID();

  const commitRaw = {
    id: commitId,
    userId,
    configurationId,
    businessDraftId: configuration.businessDraftId,
    committedAt: now,
    source: "configuration_commit",
  };

  const parsed = OwnerSchema.safeParse(commitRaw);
  if (!parsed.success) {
    throw new Error("INVALID_USER_COMMIT");
  }

  await env.ON_USERS_KV.put(
    userCommitKey(parsed.data.id),
    JSON.stringify(parsed.data)
  );

  await env.ON_USERS_KV.put(
    userLastCommitKey(userId),
    parsed.data.id
  );

  return { ok: true };
}

// ======================================================
// ROUTE
// ======================================================
export async function commitConfigurationRoute(
  request: Request,
  env: Env
) {
  // =========================
  // AUTH
  // =========================
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  // =========================
  // INPUT
  // =========================
  let body: { configurationId?: string };
  try {
    body = await request.json();
  } catch {
    return json(
      { ok: false, error: "INVALID_BODY" },
      request,
      env,
      400
    );
  }

  if (!body.configurationId) {
    return json(
      { ok: false, error: "CONFIGURATION_ID_MISSING" },
      request,
      env,
      400
    );
  }

  // =========================
  // EXECUTE
  // =========================
  try {
    await commitConfiguration(
      env,
      body.configurationId,
      session.user.id
    );

    return json({ ok: true }, request, env, 200);
  } catch (err: any) {
    return json(
      { ok: false, error: err.message ?? "COMMIT_FAILED" },
      request,
      env,
      400
    );
  }
}


=== FILE: routes/configuration.base.read.ts
LANG: ts
SIZE:     1249 bytes
----------------------------------------
// ======================================================
// BE || CONFIGURATION — READ BASE (USER)
// ======================================================
//
// ENDPOINT:
// - GET /api/configuration/base/:id
//
// USO:
// - Dashboard post-login
// - Start configurator
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import { getConfiguration } from "..";
import { toBaseReadDTO } from "../mappers/configuration.draft.mapper";

export async function readConfigurationBase(
  request: Request,
  env: Env,
  id: string
) {
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const configuration = await getConfiguration(env, id);
  if (!configuration) {
    return json({ ok: false, error: "NOT_FOUND" }, request, env, 404);
  }

  if (configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  return json(
    {
      ok: true,
      configuration: toBaseReadDTO(configuration),
    },
    request,
    env
  );
}


=== FILE: routes/configuration.base.write.ts
LANG: ts
SIZE:     3203 bytes
----------------------------------------
// ======================================================
// BE || CONFIGURATION — CREATE BASE (BOOTSTRAP)
// ======================================================
//
// RUOLO:
// - Creare una Configuration BASE (workspace vuoto)
// - Primo punto di ingresso post-login
//
// INVARIANTI:
// - NON legge Business
// - NON scrive Business
// - NON gestisce contenuti
// - NON gestisce pricing
// - Backend = source of truth
//
// FLOW:
// BuyFlow → LOGIN → CREATE BASE → DASHBOARD
// ======================================================

import { ConfigurationBaseInputSchema } from "../schema/configuration.draft.schema";
import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";
import {
  buildConfigurationId,
  configurationKey,
  userConfigurationsKey,
} from "../index";
import type { ConfigurationDTO } from "../schema/configuration.schema";

export async function createConfigurationBase(
  request: Request,
  env: Env
) {
  // =========================
  // AUTH
  // =========================
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  // =========================
  // INPUT
  // =========================
  const body = ConfigurationBaseInputSchema.parse(
    await request.json()
  );
  const businessDraftId = crypto.randomUUID();

  // =========================
  // BUILD CONFIGURATION ID
  // =========================
  const configurationId = crypto.randomUUID();

  const key = configurationKey(configurationId);

  // =========================
  // GUARD — IDEMPOTENZA
  // =========================
  const existing =
    (await env.CONFIGURATION_KV.get(
      key,
      "json"
    )) as ConfigurationDTO | null;

  if (existing) {
    return json(
      { ok: true, configurationId },
      request,
      env
    );
  }

  // =========================
  // CREATE BASE CONFIGURATION
  // =========================
  const now = new Date().toISOString();

  const configuration: ConfigurationDTO = {
    //identityId,  // Qui dovremmo usare WOD 
    id: configurationId,
    userId: session.user.id,
  
    solutionId: body.solutionId,
    productId: body.productId,
  
    prefill: {
      businessName: body.businessName,
    },
    status: "DRAFT",
   
  
    businessDraftId ,
    options: [],
    data: {},
  
      
    createdAt: now,
    updatedAt: now,
  };
  
  await env.CONFIGURATION_KV.put(
    key,
    JSON.stringify(configuration)
  );

  // =========================
  // INDEX USER → CONFIGURATIONS
  // =========================
  const listKey = userConfigurationsKey(session.user.id);
  const list: string[] =
    (await env.CONFIGURATION_KV.get(
      listKey,
      "json"
    )) ?? [];

  if (!list.includes(configurationId)) {
    list.push(configurationId);
    await env.CONFIGURATION_KV.put(
      listKey,
      JSON.stringify(list)
    );
  }

  // =========================
  // RESPONSE
  // =========================
  return json(
    { ok: true, configurationId },
    request,
    env
  );
}


=== FILE: routes/configuration.preview.read.ts
LANG: ts
SIZE:     3089 bytes
----------------------------------------
// ======================================================
// BE || CONFIGURATION || PREVIEW READ
// GET /api/configuration/:id/preview
// ======================================================
//
// RUOLO:
// - Restituisce i dati per Site Preview
// - Astratto da Business / BusinessDraft
//
// INVARIANTI:
// - Auth obbligatoria
// - Ownership check
// - 1 sola response shape
// ======================================================

import type { Env } from "../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

import { getConfiguration } from "..";
import { toBusinessPreviewDTO } from
  "@domains/business/mappers/business.preview.mapper";

export async function readConfigurationPreview(
  request: Request,
  env: Env,
  id: string
): Promise<Response> {
  /* =====================
     1️⃣ AUTH
  ====================== */
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  /* =====================
     2️⃣ LOAD CONFIGURATION
  ====================== */
  const configuration = await getConfiguration(env, id);
  if (!configuration) {
    return json({ ok: false, error: "CONFIGURATION_NOT_FOUND" }, request, env, 404);
  }

  if (configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  /* =====================
     3️⃣ RESOLVE SOURCE
  ====================== */

  // 3A — BUSINESS FINALE
  if (configuration.businessId) {
    const rawBusiness = await env.BUSINESS_KV.get(
      `BUSINESS:${configuration.businessId}`,
      "json"
    );

    if (!rawBusiness) {
      return json({ ok: false, error: "BUSINESS_NOT_FOUND" }, request, env, 404);
    }

    const business = rawBusiness as any;

    return json(
      {
        ok: true,
        preview: toBusinessPreviewDTO(business, false),
      },
      request,
      env
    );
  }

  // 3B — BUSINESS DRAFT
  if (configuration.businessDraftId) {
    const rawDraft = await env.BUSINESS_KV.get(
      `BUSINESS_DRAFT:${configuration.businessDraftId}`,
      "json"
    );

    if (!rawDraft) {
      return json({ ok: false, error: "BUSINESS_DRAFT_NOT_FOUND" }, request, env, 404);
    }

    const draft = rawDraft as any;

    return json(
      {
        ok: true,
        preview: toBusinessPreviewDTO(draft, true),
      },
      request,
      env
    );
  }

  /* =====================
     4️⃣ EMPTY PREVIEW (BOOTSTRAP)
  ====================== */
  return json(
    {
      ok: true,
      preview: {
        id: id,
        isDraft: true,
        businessName: configuration.prefill?.businessName ?? "Attività",
        contact: {},
        openingHours: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
        businessDescriptionTags: [],
        businessServiceTags: [],
      },
    },
    request,
    env
  );
}

=== FILE: routes/configuration.projectEsecution.schema.ts
LANG: ts
SIZE:     1283 bytes
----------------------------------------
/**
 * ======================================================
 * PROJECT SETUP — DOMAIN SCHEMA (V1)
 * ======================================================
 *
 * COSA RAPPRESENTA:
 * - Configurazione OPERATIVA del progetto
 * - Inserita DOPO un ordine pagato
 * - Usata per eseguire il servizio (design / contenuti)
 *
 * COSA NON È:
 * - NON è un ordine
 * - NON è un atto economico
 * - NON influisce su prezzi o pagamenti
 *
 * RELAZIONE:
 * - Associato a un EconomicOrder / CheckoutOrder tramite orderId
 * - Persistito separatamente (PROJECT_SETUP:{orderId})
 *
 * NOTE:
 * - Dominio MUTABILE
 * - Aggiornabile più volte
 *
 * ======================================================
 */


import { z } from "zod";

export const OrderSetupSchema = z.object({
  businessName: z.string().min(1),
  sector: z.string().min(1),
  city: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),

  primaryColor: z.string().min(1),
  style: z.enum(["modern", "elegant", "minimal", "bold"]),

  description: z.string().min(1),
  services: z.string().min(1),
  cta: z.string().min(1),

  extras: z.object({
    maps: z.boolean(),
    whatsapp: z.boolean(),
    newsletter: z.boolean(),
  }),
});

export type OrderSetupDTO = z.infer<typeof OrderSetupSchema>;


=== FILE: routes/configuration.read.ts
LANG: ts
SIZE:     2798 bytes
----------------------------------------
// ======================================================
// BE || routes/configuration/configuration.user.ts
// ======================================================
//
// CONFIGURATION — USER SIDE
//
// RUOLO:
// - CRUD configurazioni utente (PRE-ORDER / DRAFT)
//
// INVARIANTI:
// - User da sessione
// - Configuration ≠ Order
// - ConfigurationId deterministico
// - CONFIGURATION_KV = source of truth
// ======================================================

import {
    ConfigurationSchema,
    configurationKey,
    userConfigurationsKey,
    getConfiguration,
    buildConfigurationId,
  } from "../../../domains/configuration";
  
  import { requireAuthUser } from "@domains/auth";
  
  import { json } from "../../../domains/auth/route/helper/https";// ✅ helper allineato
  import { BUSINESS_KEY } from "../../../lib/kv";
  import { BusinessSchema } from "../../../domains/business/schema/business.schema";
  import type { Env } from "../../../types/env";
  
  /* ======================================================
     GET /api/configuration
     LIST USER CONFIGURATIONS
  ====================================================== */
  export async function listUserConfigurations(
    request: Request,
    env: Env
  ) {
    const session = await requireAuthUser(request, env);
    if (!session) {
      return json(
        { ok: false, error: "UNAUTHORIZED" },
        request,
        env,
        401
      );
    }
  
    const listKey = userConfigurationsKey(session.user.id);
    const ids: string[] =
      (await env.CONFIGURATION_KV.get(listKey, "json")) ?? [];
  
    const items = await Promise.all(
      ids.map((id) =>
        env.CONFIGURATION_KV.get(configurationKey(id), "json")
      )
    );
  
    return json(
      {
        ok: true,
        items: items.filter(Boolean),
      },
      request,
      env
    );
  }
  
  /* ======================================================
     GET /api/configuration/:id
  ====================================================== */
  export async function getUserConfiguration(
    request: Request,
    env: Env,
    id: string
  ) {
    const session = await requireAuthUser(request, env);
    if (!session) {
      return json(
        { ok: false, error: "UNAUTHORIZED" },
        request,
        env,
        401
      );
    }
  
    const configuration = await getConfiguration(env, id);
    if (!configuration) {
      return json(
        { ok: false, error: "NOT_FOUND" },
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
  
    return json(
      { ok: true, configuration },
      request,
      env
    );
  }
  


=== FILE: routes/configuration.set-draft.ts
LANG: ts
SIZE:     3381 bytes
----------------------------------------
// ======================================================
// BE || CONFIGURATION — SET DRAFT
// ======================================================
//
// RUOLO:
// - Riporta una Configuration allo stato DRAFT
// - Consente la riapertura del configurator
//
// INVARIANTI:
// - Auth obbligatoria
// - Configuration = source of truth
// - Operazione IDEMPOTENTE
// - NON modifica BusinessDraft
// - NON modifica OwnerDraft
//
// FLOW:
// Business View → "Modifica sito" → SET DRAFT → WORKSPACE
// ======================================================

import type { Env } from "../../../types/env";
import type { ConfigurationDTO } from "../schema/configuration.schema";
import { requireAuthUser } from "@domains/auth";
import { json } from "@domains/auth/route/helper/https";

// =========================
// INPUT DTO
// =========================
type SetDraftInputDTO = {
  configurationId: string;
};

// =========================
// KV HELPERS
// =========================
const configurationKey = (id: string) =>
  `CONFIGURATION:${id}`;

// ======================================================
// HANDLER
// ======================================================
export async function setConfigurationDraft(
  request: Request,
  env: Env
) {
  // =========================
  // AUTH
  // =========================
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  // =========================
  // INPUT
  // =========================
  let body: SetDraftInputDTO;
  try {
    body = await request.json();
  } catch {
    return json(
      { ok: false, error: "INVALID_JSON" },
      request,
      env,
      400
    );
  }

  if (!body?.configurationId) {
    return json(
      { ok: false, error: "CONFIGURATION_ID_MISSING" },
      request,
      env,
      400
    );
  }

  // =========================
  // LOAD CONFIGURATION
  // =========================
  const configuration =
    (await env.CONFIGURATION_KV.get(
      configurationKey(body.configurationId),
      "json"
    )) as ConfigurationDTO | null;

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

  // =========================
  // GUARD — IDEMPOTENZA
  // =========================
  if (configuration.status === "DRAFT") {
    return json(
      {
        ok: true,
        configurationId: configuration.id,
        status: "DRAFT",
        alreadyDraft: true,
      },
      request,
      env
    );
  }
  // =========================
  // SET DRAFT
  // =========================
  const now = new Date().toISOString();

  const updated: ConfigurationDTO = {
    ...configuration,
    status: "CONFIGURATION_IN_PROGRESS",
    updatedAt: now,
  };

  await env.CONFIGURATION_KV.put(
    configurationKey(body.configurationId),
    JSON.stringify(updated)
  );


  // =========================
  // RESPONSE
  // =========================
  return json(
    {
      ok: true,
      configurationId: configuration.id,
      status: "CONFIGURATION_IN_PROGRESS",
    },
    request,
    env
  );
}


=== FILE: routes/configuration.user.delete.ts
LANG: ts
SIZE:     2128 bytes
----------------------------------------
/* ======================================================
   DELETE /api/configuration/:id
   DELETE USER CONFIGURATION (PERMANENT)
====================================================== */

import { Env} from "../../../types/env";
import { requireAuthUser
 } from "@domains/auth";
 import { json } from "@domains/auth/route/helper/https";

 import {

    configurationKey,
    userConfigurationsKey,
    getConfiguration,
 
  } from "..";


  export async function deleteUserConfiguration(

    request: Request,
    env: Env,
    id: string
  ) {
    // =========================
    // AUTH
    // =========================
    const session = await requireAuthUser(request, env);
    if (!session) {
      return json(
        { ok: false, error: "UNAUTHORIZED" },
        request,
        env,
        401
      );
    }
  
    // =========================
    // LOAD CONFIGURATION
    // =========================
    const configuration = await getConfiguration(env, id);
    if (!configuration) {
      return json(
        { ok: false, error: "NOT_FOUND" },
        request,
        env,
        404
      );
    }
  
    // =========================
    // OWNERSHIP CHECK
    // =========================
    if (configuration.userId !== session.user.id) {
      return json(
        { ok: false, error: "FORBIDDEN" },
        request,
        env,
        403
      );
    }
  
    // =========================
    // DELETE CONFIGURATION
    // =========================
    await env.CONFIGURATION_KV.delete(configurationKey(id));
  
    // =========================
    // UPDATE USER INDEX
    // =========================
    const listKey = userConfigurationsKey(session.user.id);
    const list: string[] =
      (await env.CONFIGURATION_KV.get(listKey, "json")) ?? [];
  
    const updatedList = list.filter(
      (configId) => configId !== id
    );
  
    await env.CONFIGURATION_KV.put(
      listKey,
      JSON.stringify(updatedList)
    );
  
    // =========================
    // RESPONSE
    // =========================
    return json(
      { ok: true },
      request,
      env
    );
  }
  

=== FILE: routes/deprecated /configuration.business.write copy.ts
LANG: ts
SIZE:     5381 bytes
----------------------------------------
// ======================================================
// BE || CONFIGURATION — UPSERT FROM BUSINESS
// ======================================================
// Deprecate passerà a site.business.build
// SCOPO:
// - Punto di CONTATTO tra BUSINESS e CONFIGURATION
//
// RESPONSABILITÀ:
// 1. Caricare il BUSINESS (source of truth)
// 2. Aggiornare il BUSINESS con i dati raccolti nello step
//    (es. TAG descrittivi / servizi)
// 3. Creare o aggiornare una CONFIGURATION
//    che REFERENZIA il business (NON lo duplica)
//
// INVARIANTI CRITICHE:
// - Le TAG appartengono SEMPRE al BUSINESS
// - La CONFIGURATION NON duplica dati di contenuto
// - CONFIGURATION.data contiene SOLO riferimenti tecnici
// - Backend = source of truth
//
// MOTIVAZIONE ARCHITETTURALE:
// - La CONFIGURATION è un WORKSPACE (canva)
// - Il BUSINESS è il CONTENUTO
// - Il layout engine leggerà:
//   GetBusiness → GetProduct → GetSolution → GetLayout
//
// ======================================================

import { z } from "zod";
import type { Env } from "../../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "../../../auth/route/helper/https";

import {configurationKey,userConfigurationsKey,buildConfigurationId,} from "../..";
import { BusinessSchema } from "@domains/business/schema/business.schema";
import { ProductSchema } from "../../../product/product.schema";
import type { ConfigurationDTO } from "../../schema/configuration.schema";

// =========================
// INPUT
// =========================
const InputSchema = z.object({
  businessId: z.string().min(1),
  productId: z.string().min(1),
  optionIds: z.array(z.string()).default([]),

  // =========================
  // TAGS — BUSINESS DOMAIN
  // =========================
  businessDescriptionTags: z.array(z.string()).optional(),
  businessServiceTags: z.array(z.string()).optional(),
});

export async function upsertConfigurationFromBusiness(
  request: Request,
  env: Env
) {
  // =========================
  // AUTH
  // =========================
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  // =========================
  // INPUT
  // =========================
  const body = InputSchema.parse(await request.json());

  // =========================
  // LOAD BUSINESS
  // =========================
  const rawBusiness = await env.BUSINESS_KV.get(
    `BUSINESS:${body.businessId}`
  );
  if (!rawBusiness) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  let business = BusinessSchema.parse(JSON.parse(rawBusiness));

  // ======================================================
  // PATCH BUSINESS — CONTENUTI + TAGS
  // ======================================================
  //
  // Tutti questi dati provengono dallo StepBusinessInfo (FE)
  // e DEVONO vivere nel BUSINESS.
  //
  // La CONFIGURATION NON li duplica.
  // ======================================================
  
  const updatedBusiness = {
    ...business,
  
    // TAGS
    descriptionTags:
      body.businessDescriptionTags ?? business.descriptionTags ?? [],
  
    serviceTags:
      body.businessServiceTags ?? business.serviceTags ?? [],
  
    // Timestamp
    updatedAt: new Date().toISOString(),
  };

  await env.BUSINESS_KV.put(
    `BUSINESS:${business.id}`,
    JSON.stringify(updatedBusiness)
  );
  // =========================
  // LOAD PRODUCT
  // =========================
  const rawProduct = await env.PRODUCTS_KV.get(
    `PRODUCT:${body.productId}`
  );
  if (!rawProduct) {
    return json(
      { ok: false, error: "PRODUCT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const product = ProductSchema.parse(JSON.parse(rawProduct));

  // =========================
  // BUILD CONFIGURATION ID
  // =========================
  const configurationId = buildConfigurationId(
    business.name,
    business.solutionId
  );
  

  const key = configurationKey(configurationId);

  // =========================
  // UPSERT CONFIGURATION
  // =========================

  const existing =
  (await env.CONFIGURATION_KV.get(key, "json")) as ConfigurationDTO | null;

  const now = new Date().toISOString();

  const configuration = {
    ...(existing ?? {}),
    id: configurationId,
    userId: session.user.id,
    solutionId : business.solutionId,
   
    productId: product.id,
    options: body.optionIds,
    
    data: existing?.data ?? {
        businessId: business.id,
      },

    status: "BUSINESS_READY",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await env.CONFIGURATION_KV.put(
    key,
    JSON.stringify(configuration)
  );

  // =========================
  // INDEX USER → CONFIGURATIONS
  // =========================
  const listKey = userConfigurationsKey(session.user.id);
  const list: string[] =
    (await env.CONFIGURATION_KV.get(listKey, "json")) ?? [];

  if (!list.includes(configurationId)) {
    list.push(configurationId);
    await env.CONFIGURATION_KV.put(
      listKey,
      JSON.stringify(list)
    );
  }

  // =========================
  // RESPONSE
  // =========================
  return json(
    { ok: true, configurationId },
    request,
    env
  );
}


=== FILE: routes/deprecated /configuration.business.write.ts
LANG: ts
SIZE:     4952 bytes
----------------------------------------
// ======================================================
// BE || CONFIGURATION — UPSERT FROM BUSINESS
// ======================================================
//
// SCOPO:
// - Punto di CONTATTO tra BUSINESS e CONFIGURATION
//
// RESPONSABILITÀ:
// 1. Caricare il BUSINESS (source of truth)
// 2. Aggiornare il BUSINESS con i dati raccolti nello step
//    (es. TAG descrittivi / servizi)
// 3. Creare o aggiornare una CONFIGURATION
//    che REFERENZIA il business (NON lo duplica)
//
// INVARIANTI CRITICHE:
// - Le TAG appartengono SEMPRE al BUSINESS
// - La CONFIGURATION NON duplica dati di contenuto
// - CONFIGURATION.data contiene SOLO riferimenti tecnici
// - Backend = source of truth
//
// MOTIVAZIONE ARCHITETTURALE:
// - La CONFIGURATION è un WORKSPACE (canva)
// - Il BUSINESS è il CONTENUTO
// - Il layout engine leggerà:
//   GetBusiness → GetProduct → GetSolution → GetLayout
//
// ======================================================

import { z } from "zod";
import type { Env } from "../../../../types/env";
import { requireAuthUser } from "@domains/auth";
import { json } from "../../../auth/route/helper/https";

import {configurationKey,userConfigurationsKey,buildConfigurationId,} from "../..";
import { BusinessSchema } from "../../../business/schema/business.schema";
import { ProductSchema } from "../../../product/product.schema";
import type { ConfigurationDTO } from "../../schema/configuration.schema";

// =========================
// INPUT
// =========================
const InputSchema = z.object({
  businessId: z.string().min(1),
  productId: z.string().min(1),
  optionIds: z.array(z.string()).default([]),


});

export async function upsertConfigurationFromBusiness(
  request: Request,
  env: Env
) {
  // =========================
  // AUTH
  // =========================
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json(
      { ok: false, error: "UNAUTHORIZED" },
      request,
      env,
      401
    );
  }

  // =========================
  // INPUT
  // =========================
  const body = InputSchema.parse(await request.json());

  // =========================
  // LOAD BUSINESS
  // =========================
  const rawBusiness = await env.BUSINESS_KV.get(
    `BUSINESS:${body.businessId}`
  );
  if (!rawBusiness) {
    return json(
      { ok: false, error: "BUSINESS_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  let business = BusinessSchema.parse(JSON.parse(rawBusiness));

  // ======================================================
  // PATCH BUSINESS — CONTENUTI + TAGS
  // ======================================================
  //
  // Tutti questi dati provengono dallo StepBusinessInfo (FE)
  // e DEVONO vivere nel BUSINESS.
  //
  // La CONFIGURATION NON li duplica.
  // ======================================================
  
  const updatedBusiness = {
    ...business,
    // Timestamp
    updatedAt: new Date().toISOString(),
  };

  await env.BUSINESS_KV.put(
    `BUSINESS:${business.id}`,
    JSON.stringify(updatedBusiness)
  );
  // =========================
  // LOAD PRODUCT
  // =========================
  const rawProduct = await env.PRODUCTS_KV.get(
    `PRODUCT:${body.productId}`
  );
  if (!rawProduct) {
    return json(
      { ok: false, error: "PRODUCT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const product = ProductSchema.parse(JSON.parse(rawProduct));

  // =========================
  // BUILD CONFIGURATION ID
  // =========================
  const configurationId = buildConfigurationId(
    business.businessName,
    business.solutionId
  );
  

  const key = configurationKey(configurationId);

  // =========================
  // UPSERT CONFIGURATION
  // =========================

  const existing =
  (await env.CONFIGURATION_KV.get(key, "json")) as ConfigurationDTO | null;

  const now = new Date().toISOString();

  const configuration = {
    ...(existing ?? {}),
    id: configurationId,
    userId: session.user.id,
    solutionId : business.solutionId,
   
    productId: product.id,
    options: body.optionIds,
    
    data: existing?.data ?? {
        businessId: business.id,
      },

    status: "BUSINESS_READY",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await env.CONFIGURATION_KV.put(
    key,
    JSON.stringify(configuration)
  );

  // =========================
  // INDEX USER → CONFIGURATIONS
  // =========================
  const listKey = userConfigurationsKey(session.user.id);
  const list: string[] =
    (await env.CONFIGURATION_KV.get(listKey, "json")) ?? [];

  if (!list.includes(configurationId)) {
    list.push(configurationId);
    await env.CONFIGURATION_KV.put(
      listKey,
      JSON.stringify(list)
    );
  }

  // =========================
  // RESPONSE
  // =========================
  return json(
    { ok: true, configurationId },
    request,
    env
  );
}


=== FILE: routes/index.ts
LANG: ts
SIZE:      881 bytes
----------------------------------------
// ======================================================
// BE || routes/configuration/index.ts
// ======================================================

export { setConfigurationDraft } from "./configuration.set-draft";

export { attachOwnerToConfiguration } from "./configuration.attach-owner.ipnut";

export { commitConfigurationRoute} from "./configuration.base.commit";

export { deleteUserConfiguration } from "./configuration.user.delete";

export {
    listUserConfigurations,
    getUserConfiguration
  } from "./configuration.read";
  
  export {
    listAllConfigurations,
  } from "./configuration.admin.read";
  export {
    upsertConfigurationFromBusiness,
  } from "./deprecated /configuration.business.write";
  export {
    createConfigurationBase,
  } from "./configuration.base.write";

 export { readConfigurationPreview } from "./configuration.preview.read";

=== FILE: schema/configuration.draft.schema.ts
LANG: ts
SIZE:      753 bytes
----------------------------------------
// ======================================================
// BE || domains/configuration/schema/configuration.base.schema.ts
// ======================================================
//
// RUOLO:
// - Input MINIMO dal BuyFlow pre-login
// - Seed iniziale della Configuration
//
// INVARIANTI:
// - NON crea Business
// - NON scrive in BUSINESS_KV
// - NON valida policy
// ======================================================

import { z } from "zod";

export const ConfigurationBaseInputSchema = z.object({

  solutionId: z.string().min(1),
  productId: z.string().min(1),
 
  // PREFILL VISITOR (non certificato)
  businessName: z.string().min(2).max(80),

});

export type ConfigurationBaseInput = z.infer<
  typeof ConfigurationBaseInputSchema
>;


=== FILE: schema/configuration.schema.ts
LANG: ts
SIZE:     2982 bytes
----------------------------------------
// ======================================================
// BE || domains/configuration/configuration.schema.ts
// ======================================================
//
// CONFIGURATION — CORE DOMAIN (WORKSPACE PRE-ORDER)
//
// RUOLO:
// - Single Source of Truth della Configuration
// - Workspace mutabile fino all’ordine
//
// INVARIANTI:
// - Configuration ≠ Business
// - Configuration ≠ Order
// - userId derivato SOLO da sessione
// - Business nasce SOLO dopo StepBusiness + Policy
// ======================================================

import { z } from "zod";

/* ======================================================
   CONFIGURATION STATUS — CANONICAL STATE MACHINE
====================================================== */

export const CONFIGURATION_STATUS = [
  // BOOTSTRAP
  "DRAFT",

  // BUSINESS SETUP
  "BUSINESS_READY",

  // CONFIGURATION SETUP
  "CONFIGURATION_IN_PROGRESS",
  "CONFIGURATION_READY",

  // PREVIEW & VALIDATION
  "PREVIEW",
  "ACCEPTED",

  // COMMERCIALE
  "ORDERED",

  // POST-ORDER
  "IN_PRODUCTION",
  "DELIVERED",

  // TERMINALI
  "CANCELLED",
  "ARCHIVED",
] as const;

export type ConfigurationStatus =
  (typeof CONFIGURATION_STATUS)[number];

/* ======================================================
   PREFILL (VISITOR / BUYFLOW)
   ⚠️ NON È BUSINESS
====================================================== */

export const ConfigurationPrefillSchema = z.object({
  businessName: z.string().min(2).max(80),
});

/* ======================================================
   WORKSPACE DATA (UI-DRIVEN)
====================================================== */

export const ConfigurationWorkspaceSchema = z.object({
  layoutId: z.string().optional(),
  themeId: z.string().optional(),
  lastPreviewAt: z.string().optional(),
});

/* ======================================================
   MAIN CONFIGURATION SCHEMA
====================================================== */

export const ConfigurationSchema = z.object({
  /* ---------- Identity ---------- */
  id: z.string().uuid(),
  userId: z.string().optional(),

  /* ---------- Business linkage (POST-STEP) ---------- */
  businessId: z.string().optional(),
/* ---------- Business draft linkage (PRE-BUSINESS) ---------- */
businessDraftId: z.string().optional(),
  /* ---------- Commercial origin ---------- */
  solutionId: z.string().min(1),
  productId: z.string().min(1),

  /* ---------- Prefill (BuyFlow) ---------- */
  prefill: ConfigurationPrefillSchema.optional(),

  /* ---------- Options ---------- */
  options: z.array(z.string()).default([]),

  /* ---------- Workspace ---------- */
  data: ConfigurationWorkspaceSchema.default({}),

  /* ---------- Status ---------- */
  status: z.enum(CONFIGURATION_STATUS),

  /* ---------- Timestamps ---------- */
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
});

export type ConfigurationDTO = z.infer<typeof ConfigurationSchema>;


=== FILE: schema/privacy.acceptance.schema.ts
LANG: ts
SIZE:      410 bytes
----------------------------------------
import { z } from "zod";

export const PrivacyAcceptanceSchema = z.object({
  accepted: z.literal(true),
  acceptedAt: z.string().min(1),
  policyVersion: z.string().min(1),

  // chi ha accettato
  subject: z.enum(["business", "owner"]),

  // opzionale: da dove
  source: z.enum(["business-form", "owner-form"]).optional(),
});

export type PrivacyAcceptanceDTO = z.infer<
  typeof PrivacyAcceptanceSchema
>;

francescomaggi@MacBook-Pro configuration % cd 