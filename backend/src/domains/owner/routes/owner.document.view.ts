// ======================================================
// BE || OWNER || DOCUMENT || VIEW (USER-SCOPED)
// GET /api/owner/document/view?configurationId=&side=front|back
// ======================================================
//
// RUOLO:
// - Ritorna il file (img) del documento Owner (front/back)
// - Owner documents sono user-scoped (KV)
// - configurationId serve SOLO per ownership guard
//
// KV:
// - OWNER_DOCUMENTS:{userId}
//
// NOTE:
// - Nel KV docs salviamo `url`, quindi qui proxy via fetch(url)
// ======================================================

import { json } from "@domains/auth/route/helper/https";
import { requireAuthUser } from "@domains/auth";
import type { Env } from "types/env";

import { OWNER_DOCUMENTS_KEY } from "../keys";
import { OwnerDocumentsSchema } from "../schema/owner.document.schema";

export async function viewOwnerDocument(
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
  const url = new URL(request.url);

  const side = url.searchParams.get("side") as "front" | "back" | null;
  const configurationId = url.searchParams.get("configurationId");

  if (!configurationId) {
    return json(
      { ok: false, error: "CONFIGURATION_ID_REQUIRED" },
      request,
      env,
      400
    );
  }

  if (!side) {
    return json({ ok: false, error: "SIDE_REQUIRED" }, request, env, 400);
  }

  /* =====================
     3️⃣ OWNERSHIP CONFIG (GUARD)
  ====================== */
  const configuration = (await env.CONFIGURATION_KV.get(
    `CONFIGURATION:${configurationId}`,
    "json"
  )) as any;

  if (!configuration) {
    return json(
      { ok: false, error: "CONFIGURATION_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  if (configuration.userId !== userId) {
    return json({ ok: false, error: "FORBIDDEN" }, request, env, 403);
  }

  /* =====================
     4️⃣ LOAD OWNER DOCUMENTS (USER-SCOPED)
  ====================== */
  const rawDocs = await env.BUSINESS_KV.get(
    OWNER_DOCUMENTS_KEY(userId),
    "json"
  );

  if (!rawDocs) {
    return json(
      { ok: false, error: "OWNER_DOCUMENTS_MISSING" },
      request,
      env,
      404
    );
  }

  const docs = OwnerDocumentsSchema.parse(rawDocs);
  const doc = docs[side];

  if (!doc?.url) {
    return json(
      { ok: false, error: "DOCUMENT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  /* =====================
     5️⃣ PROXY FILE (R2 PUBLIC URL)
  ====================== */
  const res = await fetch(doc.url);

  if (!res.ok || !res.body) {
    return json(
      { ok: false, error: "OBJECT_NOT_FOUND" },
      request,
      env,
      404
    );
  }

  return new Response(res.body, {
    headers: {
      "Content-Type":
        res.headers.get("content-type") ?? "application/octet-stream",
      // opzionale: caching soft
      // "Cache-Control": "private, max-age=60",
    },
  });
}
