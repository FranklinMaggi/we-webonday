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
  } from "../../configuration";
  
  import { requireAuthUser } from "@domains/auth";
  
  import { json } from "../../auth/route/helper/https";// ✅ helper allineato
  import { BUSINESS_KEY } from "../../../lib/kv";
  import { BusinessSchema } from "../schema/business.schema";
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
  
  /* ======================================================
     POST /api/configuration
     CREATE (IDEMPOTENT)
  ====================================================== */
  export async function createConfiguration(
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
  
    let body;
    try {
      body = ConfigurationSchema.parse(await request.json());
    } catch {
      return json(
        { ok: false, error: "INVALID_INPUT" },
        request,
        env,
        400
      );
    }
  
    /* =====================
       LOAD BUSINESS
    ====================== */
    const businessId = await env.BUSINESS_KV.get(
      `USER_BUSINESS:${session.user.id}`
    );
  
    if (!businessId) {
      return json(
        { ok: false, error: "BUSINESS_NOT_FOUND" },
        request,
        env,
        404
      );
    }
  
    const rawBusiness = await env.BUSINESS_KV.get(
      BUSINESS_KEY(businessId)
    );
  
    if (!rawBusiness) {
      return json(
        { ok: false, error: "BUSINESS_NOT_FOUND" },
        request,
        env,
        404
      );
    }
  
    const business = BusinessSchema.parse(JSON.parse(rawBusiness));
  
    /* =====================
       BUILD CONFIGURATION ID
    ====================== */
    const configurationId = buildConfigurationId(
      business.name,
      body.solutionId
    );
  
    const key = configurationKey(configurationId);
  
    /* =====================
       IDEMPOTENCY GUARD
    ====================== */
    const existing = await env.CONFIGURATION_KV.get(key);
    if (existing) {
      return json(
        {
          ok: true,
          configuration: JSON.parse(existing),
          idempotent: true,
        },
        request,
        env
      );
    }
  
    /* =====================
       CREATE CONFIGURATION (DRAFT)
    ====================== */
    const now = new Date().toISOString();
  
    const configuration = {
      id: configurationId,
      userId: session.user.id,
      businessId: business.id,
  
      ...body,
  
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
  
    await env.CONFIGURATION_KV.put(
      key,
      JSON.stringify(configuration)
    );
  
    /* =====================
       INDEX USER → CONFIGURATIONS
    ====================== */
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
  
    return json(
      { ok: true, configuration },
      request,
      env
    );
  }
  
  /* ======================================================
     PUT /api/configuration/:id
     UPDATE DRAFT
  ====================================================== */
  export async function updateConfiguration(
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
  
    const existing = await getConfiguration(env, id);
    if (!existing) {
      return json(
        { ok: false, error: "NOT_FOUND" },
        request,
        env,
        404
      );
    }
  
    if (existing.userId !== session.user.id) {
      return json(
        { ok: false, error: "FORBIDDEN" },
        request,
        env,
        403
      );
    }
  
    let patch;
    try {
      patch = ConfigurationSchema.partial().parse(
        await request.json()
      );
    } catch {
      return json(
        { ok: false, error: "INVALID_INPUT" },
        request,
        env,
        400
      );
    }
    function normalizeBusinessTags(input: unknown): string[] {
      if (!Array.isArray(input)) return [];
    
      return Array.from(
        new Set(
          input
            .filter((t) => typeof t === "string")
            .map((t) =>
              t
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
            )
            .filter(Boolean)
        )
      );
    }
    
    const updated = {
      ...existing,
      ...patch,
      // 🔒 normalizzazione tag
  descriptionTags: patch.descriptionTags
  ? normalizeBusinessTags(patch.descriptionTags)
  : existing.descriptionTags,
      updatedAt: new Date().toISOString(),
    };
  
    await env.CONFIGURATION_KV.put(
      configurationKey(id),
      JSON.stringify(updated)
    );
  
    return json(
      { ok: true, configuration: updated },
      request,
      env
    );
  }
  