import type { Env } from "../../../../types/env";
import { UserSchema } from "../Schema/user.schema";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function listAdminUsers(
  _request: Request,
  env: Env
): Promise<Response> {
  const list = await env.ON_USERS_KV.list({ prefix: "USER:" });

  const users = [];

  for (const key of list.keys) {
    const raw = await env.ON_USERS_KV.get(key.name);
    if (!raw) continue;

    try {
      const user = UserSchema.parse(JSON.parse(raw));

      users.push({
        id: user.id,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
      });
    } catch {
      console.error("Invalid USER:", key.name);
    }
  }

  users.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return json({ ok: true, users });
}
