/**
 * ============================================================
 * REGISTER USER (PASSWORD)
 * POST /api/user/register
 * ============================================================
 *
 * RUOLO:
 * - Registrare un nuovo utente password-based
 * - Delegare TUTTA la creazione account a createUser
 *
 * INVARIANTI:
 * - Nessuna scrittura KV diretta
 * - Nessuna validazione UserSchema qui
 * - createUser è la Source of Truth
 * ============================================================
 */

import { z } from "zod";
import type { Env } from "../../../../types/env";

import { buildSessionCookie } from "../../session/auth.session.cookies";
import { mapPasswordLogin, createUser } from "@domains/auth";
import { json } from "../helper/https";

/**
 * Input schema — SOLO per questa route
 * (NON dominio User)
 */
const RegisterInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerUser(
  request: Request,
  env: Env
) {
  let raw: string;

  try {
    raw = await request.text();
  } catch {
    return json(
      { ok: false, error: "BODY_READ_FAILED" },
      request,
      env,
      400
    );
  }

  let input;
  try {
    input = RegisterInputSchema.parse(JSON.parse(raw));
  } catch (err) {
    console.log("[REGISTER][INVALID_INPUT]", raw, err);
    return json(
      {
        ok: false,
        error: "INVALID_INPUT",
        details: err instanceof Error ? err.message : err,
      },
      request,
      env,
      400
    );
  }

  const { email, password } = input;

  // =====================
  // 2️⃣ Hash password
  // =====================
  const hashBuf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  );

  const passwordHash = [...new Uint8Array(hashBuf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // =====================
  // 3️⃣ Build AuthIdentity
  // =====================
  const identity = mapPasswordLogin(
    email,
    passwordHash
  );

  // =====================
  // 4️⃣ Create or resolve user
  // =====================
  const { userId, isNew } = await createUser(env, identity);

if (!isNew) {
  return json(
    {
      ok: false,
      error: "EMAIL_ALREADY_REGISTERED",
    },
    request,
    env,
    409
  );
}

  // =====================
  // 5️⃣ Create session
  // =====================
  const cookie = buildSessionCookie(
    env,
    userId,
    request
  );

  const response = json(
    {
      ok: true,
      userId,
      membershipLevel: "copper",
      isNew: true,
    },
    request,
    env,
    201
  );
  response.headers.set("Set-Cookie", cookie);
  return response;
}