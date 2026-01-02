// ======================================================
// ADMIN || SOLUTIONS
// ======================================================
//
// RESPONSABILITÀ:
// - Creazione / aggiornamento Solution
// - Listing (tutti gli stati)
// - Lettura singola (edit)
//
// PRINCIPI:
// - Backend = source of truth
// - KV contiene SOLO SolutionSchema valido
// - Nessuna logica FE qui
// ======================================================

import type { Env } from "../../types/env";
import { SolutionSchema } from "../../schemas/core/solutionSchema";
import { requireAdmin } from "./admin.guard";

/* =========================
   JSON HELPER
========================= */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/* ======================================================
   GET /api/admin/solutions/list
====================================================== */
export async function listAdminSolutions(
  request: Request,
  env: Env
): Promise<Response> {
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  const list = await env.SOLUTIONS_KV.list({ prefix: "SOLUTION:" });
  const solutions = [];

  for (const key of list.keys) {
    const raw = await env.SOLUTIONS_KV.get(key.name);
    if (!raw) continue;

    try {
      const parsed = SolutionSchema.parse(JSON.parse(raw));
      solutions.push(parsed);
    } catch (err) {
      console.error("Invalid SOLUTION in KV:", key.name, err);
    }
  }

  return json({ ok: true, solutions });
}

/* ======================================================
   GET /api/admin/solution?id=XXX
====================================================== */
export async function getAdminSolution(
  request: Request,
  env: Env
): Promise<Response> {
  const guard = requireAdmin(request, env);
  if (guard) return guard;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ ok: false, error: "MISSING_SOLUTION_ID" }, 400);

  const raw = await env.SOLUTIONS_KV.get(`SOLUTION:${id}`);
  if (!raw) return json({ ok: false, error: "SOLUTION_NOT_FOUND" }, 404);

  try {
    const solution = SolutionSchema.parse(JSON.parse(raw));
    return json({ ok: true, solution });
  } catch (err) {
    console.error("Corrupted SOLUTION:", id, err);
    return json({ ok: false, error: "CORRUPTED_SOLUTION" }, 500);
  }
}

/* ======================================================
   PUT /api/admin/solutions/register
====================================================== */
export async function registerSolution(
    request: Request,
    env: Env
  ): Promise<Response> {
    /* =========================
       ADMIN GUARD
    ========================= */
    const guard = requireAdmin(request, env);
    if (guard) return guard;
  
    /* =========================
       PARSE JSON
    ========================= */
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "INVALID_JSON" }, 400);
    }
  
    if (!body || typeof body !== "object" || !("id" in body)) {
      return json({ ok: false, error: "MISSING_SOLUTION_ID" }, 400);
    }
  
    const now = new Date().toISOString();
  
    /* =========================
       CREATED_AT IDPOTENTE
       (RECUPERO SE ESISTE)
    ========================= */
    let createdAt = now;
  
    const existingRaw = await env.SOLUTIONS_KV.get(
      `SOLUTION:${(body as any).id}`
    );
  
    if (existingRaw) {
      try {
        const existing = JSON.parse(existingRaw);
        createdAt = existing.createdAt ?? now;
      } catch {
        /* ignora, fallback su now */
      }
    }
  
    /* =========================
       MERGE TIMESTAMPS DOMINIO
    ========================= */
    const withTimestamps = {
      ...(body as any),
      createdAt,
      updatedAt: now,
    };
  
    try {
      /* =========================
         VALIDAZIONE DOMINIO
      ========================= */
      const validated = SolutionSchema.parse(withTimestamps);
  
      /* =========================
         GUARD CROSS-DOMAIN
         productIds DEVONO ESISTERE
      ========================= */
      for (const productId of validated.productIds) {
        const raw = await env.PRODUCTS_KV.get(`PRODUCT:${productId}`);
        if (!raw) {
          return json(
            { ok: false, error: `PRODUCT_NOT_FOUND:${productId}` },
            400
          );
        }
      }
  
      /* =========================
         UPSERT KV
      ========================= */
      await env.SOLUTIONS_KV.put(
        `SOLUTION:${validated.id}`,
        JSON.stringify(validated)
      );
  
      return json({ ok: true, solution: validated });
  
    } catch (err) {
      console.error("[SOLUTION VALIDATION ERROR]", err);
      return json({ ok: false, error: "INVALID_SOLUTION" }, 400);
    }
  }
  