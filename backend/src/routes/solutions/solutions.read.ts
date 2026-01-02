/* AI-SUPERCOMMENT
 * FILE: backend/src/routes/solutions/solutions.read.ts
 *
 * RUOLO:
 * - Espone il catalogo pubblico delle soluzioni
 *
 * DOMINIO:
 * - Lettura SOLA
 * - Nessuna logica di business
 *
 * NON FA:
 * - NON modifica KV
 * - NON risolve prodotti
 *
 * CONNECT POINT:
 * - FE Home / Soluzioni
 */
// ⚠️ DEPRECATED
// Non usato dal router.
// Sostituito da solutions.public.ts

import type { Env } from "../../types/env";
import { SolutionSchema } from "../../schemas/core/solutionSchema";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function listSolutions(env: Env): Promise<Response> {
  const list = await env.SOLUTIONS_KV.list({ prefix: "SOLUTION:" });
  const solutions = [];

  for (const key of list.keys) {
    const raw = await env.SOLUTIONS_KV.get(key.name);
    if (!raw) continue;

    try {
      const solution = SolutionSchema.parse(JSON.parse(raw));
      if (solution.status === "ACTIVE") {
        solutions.push(solution);
      }
    } catch (err) {
      console.error("INVALID SOLUTION:", key.name, err);
    }
  }

  solutions.sort((a, b) => a.name.localeCompare(b.name));

  return json({ ok: true, solutions });
}
