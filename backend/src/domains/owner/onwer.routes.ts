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
  createBusinessOwnerDraft,
  getBusinessOwnerDraft,
  confirmBusinessOwner,
  initOwnerVerification,
  uploadOwnerDocument,
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

  if (pathname === "/api/owner/create-draft" && method === "POST") {
    return withCors(
      await createBusinessOwnerDraft(request, env),
      request,
      env
    );
  }

  if (pathname === "/api/owner/get-draft" && method === "GET") {
    return withCors(
      await getBusinessOwnerDraft(request, env),
      request,
      env
    );
  }

  if (pathname === "/api/owner/confirm" && method === "POST") {
    return withCors(
      await confirmBusinessOwner(request, env),
      request,
      env
    );
  }

  /* ======================================================
     OWNER — VERIFICATION
  ====================================================== */

  if (
    pathname === "/api/owner/verification/init" &&
    method === "POST"
  ) {
    return withCors(
      await initOwnerVerification(request, env),
      request,
      env
    );
  }

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

  return null;
}