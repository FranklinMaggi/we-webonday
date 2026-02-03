/* ======================================================
   AI_SUPERCOMMENT
   ======================================================
   FILE ROLE:
   - Lettura amministrativa delle OPTION
   - Usato da dashboard admin (no mutazioni)

   CONNECT POINTS:
   - index.ts → GET /api/admin/options/list
   - KV: OPTIONS_KV
   - Schema: OptionSchema

   SECURITY:
   - Accesso protetto da requireAdmin (x-admin-token)
   - Nessun accesso pubblico previsto

   RUNTIME ASSUMPTIONS:
   - Tutte le option in KV sono serializzate correttamente
   - OptionSchema è la source of truth
   - Le option NON vengono filtrate per status (ACTIVE/ARCHIVED)

   TESTED VIA:
   - curl GET /api/admin/options/list
   - 2026-01-05

   KNOWN LIMITS / BUG SILENTI:
   - Nessuna paginazione (potenziale limite futuro)
   - Nessun ordinamento esplicito (dipende da KV.list)
====================================================== */
import type { Env } from "../../../types/env";
import { OptionSchema } from "../../product/schema/option.schema";
import { requireAdmin } from "../../auth/route/admin/guard/admin.guard";
import { unknown, z } from "zod";


function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
  
/* ======================================================
   GET /api/admin/options/list
====================================================== */
export async function listAdminOptions(
  request: Request,
  env: Env
): Promise<Response> {

  const guard = requireAdmin(request, env);
  if (guard) return guard;

  const list = await env.OPTIONS_KV.list({ prefix: "OPTION:" });
  const options = [];

  for (const key of list.keys) {
    const raw = await env.OPTIONS_KV.get(key.name);
    if (!raw) continue;

    try {
      const parsed = OptionSchema.parse(JSON.parse(raw));
      options.push(parsed);
    } catch (err) {
      console.error("INVALID OPTION IN KV:", key.name, err);
    }
  }

  return json({ ok: true, options });
}
/* ======================================================
   GET /api/admin/option?id=XXX
====================================================== */
export async function getAdminOption(
    request: Request,
    env: Env
  ): Promise<Response> {
  
    const guard = requireAdmin(request, env);
    if (guard) return guard;
  
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return json({ ok: false, error: "MISSING_OPTION_ID" }, 400);
    }
  
    const raw = await env.OPTIONS_KV.get(`OPTION:${id}`);
    if (!raw) {
      return json({ ok: false, error: "OPTION_NOT_FOUND" }, 404);
    }
  
    try {
      const option = OptionSchema.parse(JSON.parse(raw));
      return json({ ok: true, option });
    } catch (err) {
      console.error("CORRUPTED OPTION:", id, err);
      return json({ ok: false, error: "CORRUPTED_OPTION" }, 500);
    }
  }
  /* ======================================================
   POST /api/admin/options/status
====================================================== */
const UpdateOptionStatusSchema = z.object({
    id: z.string().min(1),
    status: z.enum(["ACTIVE", "ARCHIVED"]),
  });
  
export async function updateOptionStatus(
    request: Request,
    env: Env
  ): Promise<Response> {
  
    const guard = requireAdmin(request, env);
    if (guard) return guard;
  
    let body = unknown;
    
    try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "INVALID_JSON" }, 400);
      }
      
      const parsed = UpdateOptionStatusSchema.safeParse(body);
      if (!parsed.success) {
        return json({ ok: false, error: "INVALID_PAYLOAD" }, 400);
      }
      
      const { id, status } = parsed.data;
    if (!id || !status) {
      return json({ ok: false, error: "INVALID_PAYLOAD" }, 400);
    }
  
    const raw = await env.OPTIONS_KV.get(`OPTION:${id}`);
    if (!raw) {
      return json({ ok: false, error: "OPTION_NOT_FOUND" }, 404);
    }
  
    const existing = OptionSchema.parse(JSON.parse(raw));
  
    const updated = {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
    };
  
    await env.OPTIONS_KV.put(
      `OPTION:${id}`,
      JSON.stringify(updated)
    );
  
    return json({ ok: true, option: updated });
  }
  