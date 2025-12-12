import type { Env } from "../types/env";

import { ActivitySchema } from "../schemas/activitySchema";

export async function logActivity(
  env: Env,
  type: string,
  userId: string | null,
  payload: any
) {
  const id = crypto.randomUUID();

  // Create payload hash
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const hashHex = [...new Uint8Array(hashBuffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const activityRaw = {
    id,
    userId,
    type,
    timestamp: new Date().toISOString(),
    hash: hashHex,
    payload,
  };

  let activity;
  try {
    activity = ActivitySchema.parse(activityRaw);
  } catch (err) {
    console.error("ACTIVITY VALIDATION FAILED:", err);
    return;
  }

  await env.ON_ACTIVITY_USER_KV.put(
    `ACTIVITY:${id}`,
    JSON.stringify(activity)
  );

  return activity;
}
