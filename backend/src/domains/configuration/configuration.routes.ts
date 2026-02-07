// ======================================================
// BE || CONFIGURATION — DOMAIN ROUTER
// ======================================================
//
// RUOLO:
// - Routing centralizzato di TUTTE le API Configuration
// - Pattern identico a handleAuthRoutes
//
// CONTRATTO:
// - Ritorna Response se matcha una route
// - Ritorna null se NON è una route Configuration
//
// NON DEVE:
// - contenere logica di dominio
// - fare validazioni
// - accedere direttamente a KV
// ======================================================

import type { Env } from "types/env";
import { withCors } from "@domains/auth";

import {
  createConfigurationBase,
  getUserConfiguration,
  listUserConfigurations,
  setConfigurationDraft,
  readConfigurationBase,
  configurationDeriveState
} from "./routes";
export async function handleConfigurationRoutes(
    request: Request,
    env: Env
  ): Promise<Response | null> {
    const { pathname } = new URL(request.url);
    const method = request.method;
  
    // CREATE
    if (pathname === "/api/configuration/create-base" && method === "POST") {
      return withCors(
        await createConfigurationBase(request, env),
        request,
        env
      );
    }
  
    // LIST
    if (pathname === "/api/configuration/get-list" && method === "GET") {
      return withCors(
        await listUserConfigurations(request, env),
        request,
        env
      );
    }
  
    // READ BASE
    if (
      pathname.startsWith("/api/configuration/read-base") &&
      method === "GET"
    ) {
      const id = pathname.split("/").pop()!;
      return withCors(
        await readConfigurationBase(request, env, id),
        request,
        env
      );
    }
  
    // READ FULL
    if (
      pathname.startsWith("/api/configuration/read") &&
      method === "GET"
    ) {
      const id = pathname.split("/").pop()!;
      return withCors(
        await getUserConfiguration(request, env, id),
        request,
        env
      );
    }
  
    // SET DRAFT
    if (pathname === "/api/configuration/set-draft" && method === "POST") {
      return withCors(
        await setConfigurationDraft(request, env),
        request,
        env
      );
    }

    // ATTACH OWNER
if (
  pathname === "/api/configuration/derive-state" &&
  method === "POST"
) {
  return withCors(
    await configurationDeriveState(request, env),
    request,
    env
  );
}
  
    return null;
  }