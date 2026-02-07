// ======================================================
// BE || BUSINESS — DOMAIN ROUTER
// ======================================================
//
// RUOLO:
// - Routing centralizzato di TUTTE le API Business
// - Pattern identico a handleConfigurationRoutes
//
// CONTRATTO:
// - Ritorna Response se matcha una route
// - Ritorna null se NON è una route Business
//
// NON DEVE:
// - contenere logica di dominio
// - fare validazioni
// - accedere a KV
// ======================================================

import type { Env } from "types/env";
import { withCors } from "@domains/auth";

import {
  upsertBusiness,
  getBusiness,
  listMyBusinesses,
  reopenBusinessDraft,
  initBusinessVerification,
  uploadBusinessMenu,
} from "./routes";

export async function handleBusinessRoutes(
  request: Request,
  env: Env
): Promise<Response | null> {
  const { pathname } = new URL(request.url);
  const method = request.method;

  /* ======================================================
     BUSINESS — DRAFT UPSERT
  ====================================================== */
  if (pathname === "/api/business/create" && method === "POST") {
    return withCors(
      await upsertBusiness(request, env),
      request,
      env
    );
  }

  /* ======================================================
     BUSINESS — DRAFT READ (PREFILL)
  ====================================================== */
  if (pathname === "/api/business/get" && method === "GET") {
    return withCors(
      await getBusiness(request, env),
      request,
      env
    );
  }

  /* ======================================================
     BUSINESS — DRAFT LIST
  ====================================================== */
  if (pathname === "/api/business/list" && method === "GET") {
    return withCors(
      await listMyBusinesses(request, env),
      request,
      env
    );
  }

  /* ======================================================
     BUSINESS — REOPEN FLOW
  ====================================================== */
  if (pathname === "/api/business/reopen-draft" && method === "POST") {
    return withCors(
      await reopenBusinessDraft(request, env),
      request,
      env
    );
  }

  /* ======================================================
     BUSINESS — VERIFICATION INIT
  ====================================================== */
  if (
    pathname === "/api/business/verification/init" &&
    method === "POST"
  ) {
    return withCors(
      await initBusinessVerification(request, env),
      request,
      env
    );
  }

  /* ======================================================
     BUSINESS — MENU UPLOAD
  ====================================================== */
  if (
    pathname === "/api/business/menu/upload" &&
    method === "POST"
  ) {
    return withCors(
      await uploadBusinessMenu(request, env),
      request,
      env
    );
  }

  return null;
}