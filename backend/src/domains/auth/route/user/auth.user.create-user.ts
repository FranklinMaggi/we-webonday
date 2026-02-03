// ======================================================
// USER — CREATE ACCOUNT (OPTIMIZED)
// ======================================================

import {
  AUTH_USER_KEY,
  AUTH_USER_EMAIL_INDEX,
  AUTH_USER_PROVIDER_INDEX,
} from "@domains/auth/keys";

import { UserBaseSchema } from "./schema/user.base.schema";
import type { AuthIdentity } from "../../identity/auth.identity.types";
import type { Env } from "../../../../types/env";

export async function createUser(
  env: Env,
  identity: AuthIdentity,
  options?: {
    passwordHash?: string;
  }
): Promise<{ userId: string; isNew: boolean }> {
  const email = identity.email.toLowerCase();

  /* =====================
     1️⃣ PROVIDER LOOKUP
  ====================== */
  const providerKey = AUTH_USER_PROVIDER_INDEX(
    identity.provider,
    identity.providerUserId
  );

  const existingUserId = await env.ON_USERS_KV.get(providerKey);
  if (existingUserId) {
    return { userId: existingUserId, isNew: false };
  }

  /* =====================
     2️⃣ BUILD USER (RAW)
  ====================== */
  const userId = crypto.randomUUID();
  const now = new Date().toISOString();

  const userRaw = {
    id: userId,
    email,

    // ✅ passwordHash SOLO se passato esplicitamente
    ...(options?.passwordHash
      ? { passwordHash: options.passwordHash }
      : {}),

    authProviders: [
      {
        provider: identity.provider,
        providerUserId: identity.providerUserId,
      },
    ],

    membershipLevel: "copper",

    legal: {
      locale: "it",
      privacy: {
        accepted: true,
        version: "v1",
        acceptedAt: now,
      },
    },

    status: "active",
    createdAt: now,
  };

  /* =====================
     3️⃣ VALIDATION (SCHEMA)
  ====================== */
  let user;
  try {
    user = UserBaseSchema.parse(userRaw);
  } catch (err) {
    console.error("[CREATE_USER][SCHEMA_INVALID]", err);
    throw new Error("USER_SCHEMA_INVALID");
  }

  /* =====================
     4️⃣ PERSISTENCE (KV)
  ====================== */
  await Promise.all([
    env.ON_USERS_KV.put(
      AUTH_USER_KEY(user.id),
      JSON.stringify(user)
    ),

    env.ON_USERS_KV.put(
      AUTH_USER_EMAIL_INDEX(user.email),
      user.id
    ),

    env.ON_USERS_KV.put(
      providerKey,
      user.id
    ),
  ]);

  /* =====================
     5️⃣ RESPONSE
  ====================== */
  return { userId: user.id, isNew: true };
}