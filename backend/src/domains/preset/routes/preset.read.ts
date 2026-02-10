import type { Env } from "types/env";
import { SitePresetSchema } from "../schema/site.preset.schema";
/**
 * ======================================================
 * READ || SITE PRESETS BY SOLUTION
 * ======================================================
 */

export async function readSitePresetsBySolution(
  env: Env,
  solutionId: string
) {
  const list = await env.SOLUTIONS_KV.list({
    prefix: `SITE_PRESET:${solutionId}:`
  });

  const presets = [];

  for (const key of list.keys) {
    const raw = await env.SOLUTIONS_KV.get(key.name);
    if (!raw) continue;

    const parsed = SitePresetSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) continue;

    if (parsed.data.status !== "ACTIVE") continue;

    presets.push(parsed.data);
  }

  return presets;
}
