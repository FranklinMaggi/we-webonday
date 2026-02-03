// ======================================================
// BE || ADMIN || CONFIGURATION || VIEW DOCUMENTS
// GET /api/admin/configuration/view-documents
//
// QUERY PARAMS:
// - configurationId=string
// - target=owner | business
// - doc=front | back | certificate
// ======================================================

import type { Env } from "types/env";
import { requireAdmin } from "@domains/auth/route/admin/guard/admin.guard";
import {
  isOwnerDocumentType,
  isBusinessDocumentType,
} from "@domains/z-admin/configurations/documents.enum";

export async function viewConfigurationDocuments(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     ADMIN GUARD
  ====================== */
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  /* =====================
     INPUT
  ====================== */
  const url = new URL(request.url);
  const configurationId = url.searchParams.get("configurationId");
  const target = url.searchParams.get("target");
  const doc = url.searchParams.get("doc");

  if (!configurationId || !target || !doc) {
    return jsonError("MISSING_PARAMS", 400);
  }

  /* =====================
     VALIDAZIONE DOMINIO
  ====================== */
  if (target === "owner" && !isOwnerDocumentType(doc)) {
    return jsonError("INVALID_OWNER_DOCUMENT_TYPE", 400);
  }

  if (target === "business" && !isBusinessDocumentType(doc)) {
    return jsonError("INVALID_BUSINESS_DOCUMENT_TYPE", 400);
  }

  /* =====================
     LOAD CONFIGURATION
  ====================== */
  const configuration = await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  );

  if (!configuration) {
    return jsonError("CONFIGURATION_NOT_FOUND", 404);
  }

  /* =====================================================
     OWNER DOCUMENTS
  ====================================================== */
  if (target === "owner") {
    const kvKey = `OWNER_DOCUMENTS:${configurationId}`;
    const docs = await env.BUSINESS_KV.get(kvKey, "json") as any;

    if (!docs?.[doc]) {
      return jsonError("DOCUMENT_NOT_FOUND", 404);
    }

    const objectKey =
      `configuration/${configurationId}/owner/document-${doc}.` +
      (docs[doc].format === "img" ? "png" : "jpg");

    return streamFromR2(env, objectKey);
  }

  /* =====================================================
     BUSINESS DOCUMENTS
  ====================================================== */
  if (target === "business") {
    const kvKey = `BUSINESS_DOCUMENTS:${configurationId}`;
    const docs = await env.BUSINESS_KV.get(kvKey, "json") as any;

    if (!docs?.certificate) {
      return jsonError("DOCUMENT_NOT_FOUND", 404);
    }

    const ext =
      docs.certificate.format === "pdf" ? "pdf" : "png";

    const objectKey =
      `configuration/${configurationId}/business/certificate.${ext}`;

    return streamFromR2(env, objectKey);
  }

  return jsonError("INVALID_TARGET", 400);
}
/* =====================
   DOC VALIDATION
===================== */

/* ======================================================
   HELPERS
====================================================== */
function jsonError(error: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error }), {
    status,
  });
}

async function streamFromR2(env: Env, key: string): Promise<Response> {
  const obj = await env.USER_IMAGES.get(key);

  if (!obj) {
    return jsonError("OBJECT_NOT_FOUND", 404);
  }

  return new Response(obj.body, {
    headers: {
      "Content-Type":
        obj.httpMetadata?.contentType ??
        "application/octet-stream",
      "Content-Disposition": "inline",
    },
  });
}