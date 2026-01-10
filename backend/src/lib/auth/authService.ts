import type { AuthIdentity } from "./types";
import type { Env } from "../../types/env";
import { UserSchema } from "../../domains/user/user.schema";

export async function resolveOrCreateUser(
  env: Env,
  identity: AuthIdentity
): Promise<{ userId: string; isNew: boolean }> {

  const providerKey = `PROVIDER:${identity.provider}:${identity.providerUserId}`;

  let userId = await env.ON_USERS_KV.get(providerKey);

  if (userId) {
    return { userId, isNew: false };
  }

  // nuovo utente
  userId = crypto.randomUUID();

  const userRaw = {
    id: userId,
    email: identity.email.toLowerCase(),
  
    // 🔐 passwordHash ESISTE SOLO per auth "password"
    ...(identity.provider === "password"
      ? { passwordHash: identity.providerUserId }
      : {}),
  
    businessName: null,
    piva: null,
  
    userType: "private",
    membershipLevel: "FREE",
    status: "active",
    createdAt: new Date().toISOString(),
  };
  
  const user = UserSchema.parse(userRaw);

  await env.ON_USERS_KV.put(`USER:${user.id}`, JSON.stringify(user));
  await env.ON_USERS_KV.put(`EMAIL:${user.email}`, user.id);
  await env.ON_USERS_KV.put(providerKey, user.id);

  return { userId, isNew: true };
}
