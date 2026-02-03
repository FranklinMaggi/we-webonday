francescomaggi@MacBook-Pro business % cd '/Users/francescomaggi/Documents/GitHub/We-WebOnDay/backend/src/domains/owner'
francescomaggi@MacBook-Pro owner % aidump
AI_DUMP_V1
ROOT: /Users/francescomaggi/Documents/GitHub/We-WebOnDay/backend/src/domains/owner
DATE: 2026-01-31T11:52:41Z
INCLUDE_EXT: js,ts,css,tsx,html,json,toml
EXCLUDE_DIRS: .wrangler,node_modules,dist,build,coverage,.next,.cache,.git,frontend/public

=== FILE: DataTransferObject/input/busienss.owner.input.dto.ts.ts
LANG: ts
SIZE:      819 bytes
----------------------------------------
// ======================================================
// DOMAIN || BUSINESS || OWNER || INPUT DTO
// ======================================================
//
// RUOLO:
// - Input FE → BE per OwnerDraft
//
// INVARIANTI:
// - NO id
// - NO verified
// - businessId obbligatorio
// ======================================================
import type { AddressDTO } from "@domains/GeneralSchema/address.schema";
import type { PrivacyAcceptanceDTO } from
  "@domains/configuration/schema/privacy.acceptance.schema";

export interface BusinessOwnerDraftInputDTO {
  configurationId:string; 
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  source?: "google" | "manual";

  address?: AddressDTO;

  contact?: {
    secondaryMail?: string;
    phone?: string;
  };

  privacy?: PrivacyAcceptanceDTO;
}


=== FILE: DataTransferObject/output/busienss.owner.output.dto.ts
LANG: ts
SIZE:     1194 bytes
----------------------------------------
// ======================================================
// DOMAIN || BUSINESS || OWNER || GET DTO
// ======================================================
//
// RUOLO:
// - Output BE → FE per recupero OwnerDraft
// - Usato da GET /api/user/business-owner
//
// NOTE:
// - Può essere undefined se non esiste
// ======================================================

import { PrivacyAcceptanceDTO } from "@domains/configuration/schema/privacy.acceptance.schema";
import type { ContactDTO } from "@domains/GeneralSchema/contact.schema";

export interface OwnerUserGetDTO {
  id: string; // userId
configurationId:string, 
  firstName?: string;
  lastName?: string;
  birthDate?: string;

  contact?: ContactDTO & {
    secondaryMail?: string;
  };

  source: "google" | "manual";
  verified: boolean;
  complete: boolean; 
}
// owner.draft.read.dto.ts


// owner.draft.read.dto.ts
export interface OwnerDraftReadDTO {
  id: string;
configurationId:string; 
  firstName?: string;
  lastName?: string;
  birthDate?: string;

  contact?: ContactDTO & {
    secondaryMail?: string;
  };
privacy?:PrivacyAcceptanceDTO;
  source: "google" | "manual";
  verified: boolean;
  complete: boolean;
}



=== FILE: DataTransferObject/output/business.owner.output.dto.ts.ts
LANG: ts
SIZE:      611 bytes
----------------------------------------
import type { ContactDTO } from "@domains/GeneralSchema/contact.schema";
import type { AddressDTO } from "@domains/GeneralSchema/address.schema";
import type { PrivacyAcceptanceDTO } from
  "@domains/configuration/schema/privacy.acceptance.schema";

export interface OwnerDraftReadDTO {
  configurationId:string ; 
  id: string;

  firstName?: string;
  lastName?: string;
  birthDate?: string;

  address?: AddressDTO;

  contact?: ContactDTO & {
    secondaryMail?: string;
    phone?: string;
  };

  privacy?: PrivacyAcceptanceDTO;
  source: "google" | "manual";
  verified: boolean;
  complete: boolean;
}


=== FILE: owner-upload/business.docuement.upload.ts
LANG: ts
SIZE:     3227 bytes
----------------------------------------
// ======================================================
// BE || BUSINESS || DOCUMENT || UPLOAD
// POST /api/business/document/upload
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "types/env";
import { BusinessDocumentsKVSchema } from "../shcema/business.document.schema";

export async function uploadBusinessDocument(
  request: Request,
  env: Env
): Promise<Response> {

  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;
  const configurationId = form.get("configurationId") as string | null;

  if (!file || !configurationId) {
    return json({ ok: false, error: "INVALID_INPUT" }, request, env, 400);
  }

  const isPdf = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");

  if (!isPdf && !isImage) {
    return json({ ok: false, error: "INVALID_FILE_TYPE" }, request, env, 400);
  }

  /* =====================
     OWNERSHIP CONFIG
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  ) as any;

  if (!configuration || configuration.userId !== session.user.id) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  /* =====================
     STORAGE TARGET
  ====================== */
  const ext = isPdf ? "pdf" : file.type.split("/")[1];
  const objectKey = `configuration/${configurationId}/business/certificate.${ext}`;

  const bucket = env.USER_IMAGES;

  await bucket.put(objectKey, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  /* =====================
     KV SAVE (OVERWRITE SAFE)
  ====================== */
  const kvKey = `BUSINESS_DOCUMENTS:${configurationId}`;
  const existingRaw = await env.BUSINESS_KV.get(kvKey, "json");

  const existing = BusinessDocumentsKVSchema.parse(existingRaw ?? {});

  // ❌ blocco overwrite solo se approved
  if (existing.certificate?.verificationStatus === "approved") {
    return json(
      { ok: false, error: "DOCUMENT_ALREADY_VERIFIED" },
      request,
      env,
      409
    );
  }

  const now = new Date().toISOString();

  const next = BusinessDocumentsKVSchema.parse({
    certificate: {
      type: "business_certificate",
      format: isPdf ? "pdf" : "img",
      url: `${env.R2_PUBLIC_BASE_URL}/${objectKey}`,
      size: file.size,
      verificationStatus: "pending",
      uploadedAt: now,
    },
  });

  await env.BUSINESS_KV.put(
    kvKey,
    JSON.stringify(next),
    {
      metadata: {
        type: "business_document",
        configurationId,
        userId: session.user.id,
      },
    }
  );
/* =====================
   UPDATE CONFIGURATION STATUS
===================== */
await env.CONFIGURATION_KV.put(
    `CONFIGURATION:${configurationId}`,
    JSON.stringify({
      ...configuration,
      status: "BUSINESS_READY",
      updatedAt: new Date().toISOString(),
    })
  );
  return json({ ok: true }, request, env);
}


=== FILE: owner-upload/owner.document.confirm.ts
LANG: ts
SIZE:     2324 bytes
----------------------------------------
// ======================================================
// BE || OWNER || DOCUMENT || CONFIRM
// POST /api/owner/document/confirm
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "types/env";

export async function confirmOwnerDocumentUpload(
  request: Request,
  env: Env
): Promise<Response> {
  const session = await requireAuthUser(request, env);
  if (!session) {
    return json({ ok: false, error: "UNAUTHORIZED" }, request, env, 401);
  }

  const body = await request.json() as {
    configurationId?: string;
    side?: "front" | "back";
    objectKey?: string;
  };

  const { configurationId, side, objectKey } = body;

  if (!configurationId || !side || !objectKey) {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }

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

  const ownerId = configuration.ownerId;
  if (!ownerId) {
    return json({ ok: false, error: "OWNER_NOT_FOUND" }, request, env, 409);
  }
  

  /* =====================
     CHECK OBJECT EXISTS
  ====================== */
  const object = await env.USER_IMAGES.head(objectKey);
  if (!object) {
    return json(
      { ok: false, error: "OBJECT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     LOAD OWNER DRAFT
  ====================== */
  const ownerKey = `OWNER:${ownerId}`;
  const raw = await env.BUSINESS_KV.get(ownerKey);
  if (!raw) {
    return json(
      { ok: false, error: "OWNER_DRAFT_MISSING" },
      request,
      env,
      409
    );
  }

  const ownerDraft = JSON.parse(raw);

  ownerDraft.documents = {
    ...ownerDraft.documents,
    [side]: {
      key: objectKey,
      uploadedAt: new Date().toISOString(),
      verified: false,
    },
  };

  ownerDraft.updatedAt = new Date().toISOString();

  await env.BUSINESS_KV.put(
    ownerKey,
    JSON.stringify(ownerDraft)
  );

  return json({ ok: true }, request, env);
}


=== FILE: owner-upload/owner.document.upload-url.ts
LANG: ts
SIZE:     4165 bytes
----------------------------------------
// ======================================================
// BE || OWNER || DOCUMENT || UPLOAD (CONFIGURATION-BASED)
// POST /api/owner/document/upload
// ======================================================
//
// RUOLO:
// - Upload documenti owner PRIMA della verifica
// - I documenti sono legati alla CONFIGURATION
// - Nessun Owner richiesto in questa fase
//
// INVARIANTI:
// - Auth obbligatoria
// - Ownership su Configuration
// - MIME ristretto (img)
// - Upload idempotente (sovrascrive stesso side)
// - VALIDAZIONE ZOD CANONICA (OwnerDocumentsSchema)
//
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "types/env";

import { OwnerDocumentsSchema } from "../../owner/shcema/owner.document.schema";


const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

const OWNER_DOCUMENTS_KEY = (configurationId: string) =>
  `OWNER_DOCUMENTS:${configurationId}`;

export async function uploadOwnerDocument(
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
     2️⃣ INPUT (MULTIPART)
  ====================== */
  const form = await request.formData();

  const file = form.get("file") as File | null;
  const side = form.get("side") as "front" | "back" | null;
  const configurationId =
    form.get("configurationId") as string | null;

  if (!file || !side || !configurationId) {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }

  if (!ALLOWED_MIME.includes(file.type)) {
    return json(
      { ok: false, error: "INVALID_MIME_TYPE" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ OWNERSHIP CONFIGURATION
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
     4️⃣ BUILD R2 OBJECT KEY
  ====================== */
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
      ? "webp"
      : "jpg";

  const objectKey =
    `configuration/${configurationId}/owner/document-${side}.${ext}`;

  /* =====================
     5️⃣ UPLOAD SU R2
  ====================== */
  await env.USER_IMAGES.put(
    objectKey,
    file.stream(),
    {
      httpMetadata: {
        contentType: file.type,
      },
    }
  );

  /* =====================
     6️⃣ VALIDATE + SAVE METADATA (KV)
     🔒 ZOD = DOMINIO BLINDATO
  ====================== */
  const now = new Date().toISOString();
  const kvKey = OWNER_DOCUMENTS_KEY(configurationId);

  // 🔹 carico stato esistente (se presente)
  const existingRaw =
    await env.BUSINESS_KV.get(kvKey, "json");

  // 🔹 valido struttura esistente (o vuota)
  const existing = OwnerDocumentsSchema.parse(
    existingRaw ?? {}
  );

  // 🔹 costruisco nuovo stato
  const next = OwnerDocumentsSchema.parse({
    ...existing,
    [side]: {
      type:
        side === "front"
          ? "identity_card_front"
          : "identity_card_back",
      format: "img",
      url: `${env.R2_PUBLIC_BASE_URL}/${objectKey}`,
      size: file.size,
      verificationStatus: "pending",
      uploadedAt: now,
    },
  });

  // 🔹 persistenza sicura
  await env.BUSINESS_KV.put(
    kvKey,
    JSON.stringify(next),
    {
      metadata: {
        type: "owner_documents",
        configurationId,
        userId: session.user.id,
      },
    }
  );

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      side,
      objectKey,
    },
    request,
    env
  );
}


=== FILE: owner-upload/owner.document.view.ts
LANG: ts
SIZE:     2399 bytes
----------------------------------------
// ======================================================
// BE || OWNER || DOCUMENT || VIEW
// GET /api/owner/document/view?side=front|back
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "types/env";

export async function viewOwnerDocument(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     AUTH
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
     INPUT
  ====================== */
  const side = new URL(request.url)
    .searchParams.get("side") as "front" | "back" | null;

  if (!side) {
    return json(
      { ok: false, error: "SIDE_REQUIRED" },
      request,
      env,
      400
    );
  }

  /* =====================
     LOAD CONFIGURATION
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${session.user.id}`,
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

  const ownerId = configuration.ownerId;
  if (!ownerId) {
    return json(
      { ok: false, error: "OWNER_NOT_FOUND" },
      request,
      env,
      409
    );
  }

  /* =====================
     LOAD OWNER
  ====================== */
  const ownerKey = `OWNER:${ownerId}`;
  const raw = await env.BUSINESS_KV.get(ownerKey);

  if (!raw) {
    return json(
      { ok: false, error: "OWNER_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const owner = JSON.parse(raw);
  const doc = owner.documents?.[side];

  if (!doc?.key) {
    return json(
      { ok: false, error: "DOCUMENT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     LOAD OBJECT (R2)
  ====================== */
  const obj = await env.USER_IMAGES.get(doc.key);
  if (!obj) {
    return json(
      { ok: false, error: "OBJECT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  return new Response(obj.body, {
    headers: {
      "Content-Type":
        obj.httpMetadata?.contentType ??
        "application/octet-stream",
    },
  });
}


=== FILE: routes/business.owner.confirm.ts
LANG: ts
SIZE:     4149 bytes
----------------------------------------
// ======================================================
// BE || BUSINESS || OWNER || CONFIRM (DRAFT)
// POST /api/business/owner/confirm
// ======================================================
//
// RUOLO:
// - Congela l'OwnerDraft associato a un BusinessDraft
// - Step OBBLIGATORIO prima della creazione del Business
//
// INVARIANTI:
// - Auth HARD obbligatoria
// - Ownership basata su BusinessDraft
// - verified → true
// - FE NON può forzare dati
// ======================================================

import { z } from "zod";
import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import { assertConfigurationOwnershipByBusinessDraft } from "@domains/business/lib/assertConfigurationOwnershipByBusinessDraft";
import { OwnerDraftSchema } from "../shcema/owner.draft.schema";

// ======================================================
// KV KEYS
// ======================================================
const OWNER_DRAFT_KEY = (userId: string) =>
  `BUSINESS_OWNER_DRAFT:${userId}`;

// ======================================================
// SCHEMAS
// ======================================================
const ConfirmOwnerInputSchema = z.object({
  businessDraftId: z.string().uuid(),
});

const OwnerConfirmedSchema = OwnerDraftSchema.extend({
  verified: z.literal(true),
});
function normalizeBusinessDraftId(id: string) {
  return id.includes(":") ? id.split(":").pop()! : id;
}
// ======================================================
// HANDLER
// ======================================================
export async function confirmBusinessOwner(
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
  let businessDraftId: string;

  try {
    const body = ConfirmOwnerInputSchema.parse(
      await request.json()
    );
    businessDraftId = body.businessDraftId;
  } catch {
    return json(
      { ok: false, error: "INVALID_INPUT" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ OWNERSHIP (DRAFT)
  ====================== */
  try {
    await assertConfigurationOwnershipByBusinessDraft(
      env,
      businessDraftId,
      session.user.id,
    );
  } catch (err: any) {
    return json(
      { ok: false, error: err.message },
      request,
      env,
      err.message === "BUSINESS_DRAFT_NOT_FOUND"
        ? 404
        : 403
    );
  }

  /* =====================
     4️⃣ LOAD OWNER DRAFT
  ====================== */
  const raw = await env.BUSINESS_KV.get(
    OWNER_DRAFT_KEY(session.user.id)
  );

  if (!raw) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     5️⃣ CONFIRM
  ====================== */
  let confirmedOwner;
  const draft = JSON.parse(raw);

  if (!draft.complete || !draft.privacy?.accepted) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_COMPLETE" },
      request,
      env,
      409
    );
  }
  try {
    confirmedOwner = OwnerConfirmedSchema.parse({
      ...JSON.parse(raw),
      verified: true,
    });
  } catch {
    return json(
      { ok: false, error: "INVALID_OWNER_CONFIRMATION" },
      request,
      env,
      400
    );
  }

  /* =====================
     6️⃣ PERSIST
  ====================== */
  await env.BUSINESS_KV.put(
    OWNER_DRAFT_KEY(session.user.id),
    JSON.stringify(confirmedOwner),
    {
      metadata: {
        type: "business_owner_confirmed",
        businessDraftId,
        ownerUserId: session.user.id,
      },
    }
  );

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      businessDraftId,
      ownerId: session.user.id,
    },
    request,
    env
  );
}


=== FILE: routes/index.ts
LANG: ts
SIZE:      742 bytes
----------------------------------------
// ======================================================
// DOMAIN || BUSINESS || OWNER || ROUTES INDEX
// ======================================================

export { createBusinessOwnerDraft } from "./owner-draft.create";
export { getBusinessOwnerDraft } from "./owner-draft.get";
export { confirmBusinessOwner } from "./business.owner.confirm";
export { initOwnerVerification } from "./owner.verification.init";
export { uploadBusinessDocument } from "../owner-upload/business.docuement.upload";
export { uploadOwnerDocument } from "../owner-upload/owner.document.upload-url";
export { confirmOwnerDocumentUpload } from "../owner-upload/owner.document.confirm";
export { viewOwnerDocument } from "../owner-upload/owner.document.view";

=== FILE: routes/owner-draft.create.ts
LANG: ts
SIZE:     5079 bytes
----------------------------------------
// ======================================================
// BE || BUSINESS || OWNER || CREATE DRAFT
// POST /api/owner/create-draft
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { ConfigurationSchema } from "@domains/configuration/schema/configuration.schema";
import { OwnerDraftSchema } from "../shcema/owner.draft.schema";
import type { BusinessOwnerDraftInputDTO } from
  "../DataTransferObject/input/busienss.owner.input.dto.ts";
import type { ConfigurationDTO } from "@domains/configuration";
// ======================================================
// KV
// ======================================================
const OWNER_DRAFT_KEY = (userId: string) =>
  `BUSINESS_OWNER_DRAFT:${userId}`;

// ======================================================
// DOMAIN HELPERS
// ======================================================
function isOwnerDraftComplete(draft: {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  address?: { street?: string; city?: string ;province?:string; region?:string; zip?:string; country?:string; };
  contact?: { phoneNumber?: string };
  privacy?: { accepted?: boolean };
}) {
  return Boolean(
    draft.firstName &&
    draft.lastName &&
    draft.birthDate &&
    draft.address?.street &&
    draft.address?.city &&
    draft.contact?.phoneNumber &&
    draft.privacy?.accepted === true
  );
}

// ======================================================
// HANDLER
// ======================================================
export async function createBusinessOwnerDraft(
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
  const key = OWNER_DRAFT_KEY(userId);
  const now = new Date().toISOString();

  /* =====================
     2️⃣ INPUT  ✅ PRIMA DI USARLO
  ====================== */
  const input = (await request.json()) as BusinessOwnerDraftInputDTO;
  const { configurationId } = input;

  if (!configurationId) {
    return json(
      { ok: false, error: "CONFIGURATION_ID_REQUIRED" },
      request,
      env,
      400
    );
  }

  /* =====================
     3️⃣ LOAD + OWNERSHIP CONFIGURATION
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

  if (configuration.userId !== userId) {
    return json(
      { ok: false, error: "FORBIDDEN" },
      request,
      env,
      403
    );
  }

  /* =====================
     4️⃣ LOAD EXISTING OWNER DRAFT (OPTIONAL)
  ====================== */
  const existingRaw = await env.BUSINESS_KV.get(key);
  const existing = existingRaw ? JSON.parse(existingRaw) : null;

  /* =====================
     5️⃣ MERGE DOMAIN DATA
  ====================== */
  const address = {
    ...existing?.address,
    ...input.address,
  };

  const contact = {
    ...existing?.contact,
    ...input.contact,
  };

  const privacy = input.privacy ?? existing?.privacy;

  const ownerDraft = {
    id: existing?.id ?? crypto.randomUUID(),
    userId,
    configurationId, // ✅ LINK ESPLICITO

    firstName: input.firstName ?? existing?.firstName,
    lastName: input.lastName ?? existing?.lastName,
    birthDate: input.birthDate ?? existing?.birthDate,

    address,
    contact,

    source: input.source ?? existing?.source ?? "manual",
    privacy,

    verified: false,

    complete: isOwnerDraftComplete({
      firstName: input.firstName ?? existing?.firstName,
      lastName: input.lastName ?? existing?.lastName,
      birthDate: input.birthDate ?? existing?.birthDate,
      address,
      contact,
      privacy,
    }),

    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  /* =====================
     6️⃣ VALIDATE (DOMAIN)
  ====================== */
  const parsed = OwnerDraftSchema.parse(ownerDraft);

  /* =====================
     7️⃣ PERSIST OWNER DRAFT
  ====================== */
  await env.BUSINESS_KV.put(
    key,
    JSON.stringify(parsed),
    {
      metadata: {
        type: "business_owner_draft",
        ownerUserId: userId,
        configurationId, // 🔗 linkage esplicito
      },
    }
  );

  /* =====================
     8️⃣ SYNC → CONFIGURATION
  ====================== */
  await env.CONFIGURATION_KV.put(
    `CONFIGURATION:${configurationId}`,
    JSON.stringify({
      ...configuration,
      ownerDraftId: parsed.id,
      updatedAt: now,
    })
  );

  /* =====================
     9️⃣ RESPONSE
  ====================== */
  return json({ ok: true }, request, env);
}

=== FILE: routes/owner-draft.get.ts
LANG: ts
SIZE:     2280 bytes
----------------------------------------
// ======================================================
// BE || BUSINESS || OWNER || GET DRAFT
// GET /api/owner/get-draft
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";
import { OwnerDraftSchema } from "../shcema/owner.draft.schema";
import type { OwnerDraftReadDTO } from
  "../DataTransferObject/output/business.owner.output.dto.ts";

// ======================================================
// KV
// ======================================================
const OWNER_DRAFT_KEY = (userId: string) =>
  `BUSINESS_OWNER_DRAFT:${userId}`;

// ======================================================
// HANDLER
// ======================================================
export async function getBusinessOwnerDraft(
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

  const key = OWNER_DRAFT_KEY(session.user.id);

  /* =====================
     2️⃣ LOAD
  ====================== */
  const raw = await env.BUSINESS_KV.get(key);
  if (!raw) {
    return json({ ok: true, owner: null }, request, env);
  }

  /* =====================
     3️⃣ VALIDATE
  ====================== */
  let parsed;
  try {
    parsed = OwnerDraftSchema.parse(JSON.parse(raw));
  } catch {
    return json(
      { ok: false, error: "INVALID_OWNER_DRAFT" },
      request,
      env,
      500
    );
  }

  /* =====================
     4️⃣ MAP → READ DTO
  ====================== */
  const owner: OwnerDraftReadDTO = {
    configurationId:parsed.configurationId, 
    id: parsed.id,
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    birthDate: parsed.birthDate,
    address: parsed.address,
    contact: parsed.contact,
    privacy: parsed.privacy,
    source: parsed.source,
    verified: parsed.verified,
    complete: parsed.complete,
  };

  /* =====================
     5️⃣ RESPONSE
  ====================== */
  return json({ ok: true, owner }, request, env);
}


=== FILE: routes/owner.verification.init.ts
LANG: ts
SIZE:     3988 bytes
----------------------------------------
// ======================================================
// BE || OWNER || VERIFICATION INIT
// POST /api/owner/verification/init
// ======================================================
//
// RUOLO:
// - Avvia la verifica Owner
// - Crea Owner (pending) SOLO se:
//   - OwnerDraft completo
//   - Documenti owner presenti (front + back)
//
// INVARIANTI:
// - Idempotente
// - Documenti letti da CONFIGURATION
// - Owner creato UNA SOLA VOLTA
//
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "../../../types/env";

import { OwnerDraftSchema } from "../shcema/owner.draft.schema";
import { OwnerSchema } from "../shcema/verified-owner.schema";
import { OwnerDocumentsSchema } from "../shcema/owner.document.schema";
// ======================================================
// KV KEYS
// ======================================================
const OWNER_KEY = (ownerId: string) => `OWNER:${ownerId}`;
const OWNER_DRAFT_KEY = (userId: string) =>
  `BUSINESS_OWNER_DRAFT:${userId}`;
const OWNER_DOCUMENTS_KEY = (configurationId: string) =>
  `OWNER_DOCUMENTS:${configurationId}`;

// ======================================================
// HANDLER
// ======================================================
export async function initOwnerVerification(
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
     2️⃣ LOAD OWNER DRAFT
  ====================== */
  const rawDraft =
    await env.BUSINESS_KV.get(OWNER_DRAFT_KEY(userId));

  if (!rawDraft) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  const draft = OwnerDraftSchema.parse(JSON.parse(rawDraft));

  if (!draft.complete) {
    return json(
      { ok: false, error: "OWNER_DRAFT_NOT_COMPLETE" },
      request,
      env,
      409
    );
  }

  /* =====================
     3️⃣ LOAD + VALIDATE DOCUMENTS (ZOD)
  ====================== */
  const rawDocs =
    await env.BUSINESS_KV.get(
      OWNER_DOCUMENTS_KEY(draft.configurationId),
      "json"
    );

  const documents = OwnerDocumentsSchema.parse(rawDocs ?? {});

  if (!documents.front || !documents.back) {
    return json(
      { ok: false, error: "OWNER_DOCUMENTS_REQUIRED" },
      request,
      env,
      409
    );
  }

  /* =====================
     4️⃣ CHECK EXISTING OWNER (IDEMPOTENTE)
  ====================== */
  const ownerKey = OWNER_KEY(draft.id);
  const existing = await env.BUSINESS_KV.get(ownerKey);

  if (existing) {
    // owner già creato → idempotenza
    return json({ ok: true }, request, env);
  }

  /* =====================
     5️⃣ CREATE OWNER (PENDING)
  ====================== */
  const now = new Date().toISOString();

  const owner = OwnerSchema.parse({
    id: draft.id,
    userId,
    ownerDraftId: draft.id,

    firstName: draft.firstName,
    lastName: draft.lastName,
    birthDate: draft.birthDate,

    address: draft.address,
    contact: draft.contact,
    source: draft.source,
    privacy: draft.privacy,

    // 🔑 DOCUMENTI COPIATI DAL KV
    documents: [
      documents.front,
      documents.back,
    ],

    verified: false,
    createdAt: now,
    updatedAt: now,
  });

  await env.BUSINESS_KV.put(
    ownerKey,
    JSON.stringify(owner),
    {
      metadata: {
        type: "owner_verification_pending",
        ownerId: draft.id,
        configurationId: draft.configurationId,
        userId,
      },
    }
  );

  /* =====================
     6️⃣ RESPONSE
  ====================== */
  return json({ ok: true }, request, env);
}


=== FILE: shcema/business.document.schema.ts
LANG: ts
SIZE:      460 bytes
----------------------------------------
import { z } from "zod";

export const BusinessDocumentSchema = z.object({
  type: z.literal("business_certificate"),
  format: z.enum(["pdf", "img"]),
  url: z.string().url(),
  size: z.number().int().positive(),

  verificationStatus: z
    .enum(["pending", "approved", "rejected"])
    .default("pending"),

  uploadedAt: z.string().datetime(),
});

export const BusinessDocumentsKVSchema = z.object({
  certificate: BusinessDocumentSchema.optional(),
});


=== FILE: shcema/owner.document.schema.ts
LANG: ts
SIZE:     1198 bytes
----------------------------------------
import { z } from "zod";

/**
 * OwnerSingleDocumentSchema
 *
 * RUOLO:
 * - Metadati di UN documento caricato dall’utente
 * - NON contiene File (solo riferimento storage)
 */
export const OwnerSingleDocumentSchema = z.object({
  /* =========================
     TIPO LOGICO
  ========================= */
  type: z.enum([
    "identity_card_front",
    "identity_card_back",
  ]),

  /* =========================
     FORMATO
  ========================= */
  format: z.literal("img"),

  /* =========================
     STORAGE
  ========================= */
  url: z.string().url(),
  size: z.number().int().positive(),

  /* =========================
     STATO VERIFICA
  ========================= */
  verificationStatus: z
    .enum(["pending", "approved", "rejected"])
    .default("pending"),

  /* =========================
     AUDIT
  ========================= */
  uploadedAt: z.string().datetime(),
});

/**
 * OwnerDocumentsSchema
 *
 * RUOLO:
 * - Collezione documenti Owner
 * - Legata alla CONFIGURATION
 * - STEP PRE-VERIFICA
 */
export const OwnerDocumentsSchema = z.object({
  front: OwnerSingleDocumentSchema.optional(),
  back: OwnerSingleDocumentSchema.optional(),
});


=== FILE: shcema/owner.draft.schema.ts
LANG: ts
SIZE:     1010 bytes
----------------------------------------
import { z } from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";
import { PrivacyAcceptanceSchema } from
  "@domains/configuration/schema/privacy.acceptance.schema";

/**
 * OwnerDraftSchema
 *
 * - Usato nel configurator
 * - Tutto opzionale tranne meta
 * - complete = calcolato dal BE
 */
export const OwnerDraftSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  configurationId:z.string().uuid(),
  /* ANAGRAFICA */
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

  /* DOMINIO */
  address: AddressSchema.optional(),
  contact: ContactSchema.optional(),

  /* META */
  source: z.enum(["google", "manual"]),
  privacy: PrivacyAcceptanceSchema.optional(),

  verified: z.boolean().default(false),
  complete: z.boolean(),

  createdAt: z.string(),
  updatedAt: z.string(),
});


=== FILE: shcema/owner.schema.ts
LANG: ts
SIZE:      940 bytes
----------------------------------------
import { z } from "zod";
import { OwnerDraftSchema } from "./owner.draft.schema";
import { OwnerDocumentsSchema } from "./owner.document.schema";

/* ======================================================
 * OWNER — FINAL ENTITY
 * ====================================================== */
export const OwnerSchema = OwnerDraftSchema.extend({
  /* =========================
     IDENTITÀ (RAFFORZATA)
  ========================= */
  id: z.string().uuid(),
  userId: z.string().uuid(),

  /* =========================
     DOCUMENTI LEGALI
  ========================= */
  documents: z.array(OwnerDocumentSchema).default([]),

  /* =========================
     STATO REALE
  ========================= */
  status: z.enum([
    "pending",     // draft completo ma non verificato
    "verified",    // documenti approvati
    "rejected",    // verifica fallita
    "suspended",
  ]),

  verifiedAt: z.string().datetime().optional(),
});


=== FILE: shcema/verified-owner.schema.ts
LANG: ts
SIZE:     1043 bytes
----------------------------------------
import { z } from "zod";
import { ContactSchema } from "@domains/GeneralSchema/contact.schema";
import { PrivacyAcceptanceSchema } from
  "@domains/configuration/schema/privacy.acceptance.schema";
import { OwnerDocumentsSchema } from "./owner.document.schema";
import { AddressSchema } from "@domains/GeneralSchema/address.schema";

export const OwnerSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    ownerDraftId: z.string().uuid(),
  
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  
    address: AddressSchema,            // OBBLIGATORIO
    contact: ContactSchema.extend({
      phoneNumber: z.string().min(6),  // telefono obbligatorio qui
    }),
  
    source: z.enum(["google", "manual"]),
    privacy: PrivacyAcceptanceSchema,
  
    documents: z.array(OwnerDocumentsSchema),
  
    verified: z.boolean().default(false),
    verifiedAt: z.string().optional(),
  
    createdAt: z.string(),
    updatedAt: z.string(),
  });
  

francescomaggi@MacBook-Pro owner % 