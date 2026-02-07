// ======================================================
// BE || OWNER — DOMAIN ROUTER
// ======================================================
//
// RUOLO:
// - Routing centralizzato di TUTTE le API Owner
// - Pattern identico a handleConfigurationRoutes
//
// CONTRATTO:
// - Ritorna Response se matcha una route
// - Ritorna null se NON è una route Owner
//
// NON DEVE:
// - contenere logica di dominio
// - fare validazioni
// - accedere a KV
// ======================================================

import type { Env } from "../../types/env";
import { withCors } from "@domains/auth";

import {
  upsertOwner ,
  getBusinessOwner,
  uploadOwnerDocument,
  readOwnerMe
} from "./routes";

export async function handleOwnerRoutes(
  request: Request,
  env: Env
): Promise<Response | null> {
  const { pathname } = new URL(request.url);
  const method = request.method;

  /* ======================================================
     OWNER — DRAFT
  ====================================================== */

  if (pathname === "/api/owner/create" && method === "POST") {
    return withCors(
      await upsertOwner(request, env),
      request,
      env
    );
  }

  if (pathname === "/api/owner/get" && method === "GET") {
    return withCors(
      await getBusinessOwner(request, env),
      request,
      env
    );
  }


  /* ======================================================
     OWNER — VERIFICATION
  ====================================================== */


  /* ======================================================
     OWNER — DOCUMENTS (WRITE ONLY)
  ====================================================== */

  if (
    pathname === "/api/owner/document/upload" &&
    method === "POST"
  ) {
    return withCors(
      await uploadOwnerDocument(request, env),
      request,
      env
    );
  }
/* ======================================================
   OWNER — READ (CANONICAL)
====================================================== */

if (pathname === "/api/owner/me" && method === "GET") {
  return withCors(
    await readOwnerMe(request, env),
    request,
    env
  );
}
  return null;
}