/**
 * ============================================================
 * REGISTER USER (PASSWORD)
 * POST /api/user/register
 * ============================================================
 */

import { z } from "zod";
import type { Env } from "../../../../types/env";

import { buildSessionCookie } from "../../session/auth.session.cookies";
import { mapPasswordLogin, createUser } from "@domains/auth";
import { getCorsHeaders } from "@domains/auth/cors/auth.cors";

/**
 * Helper JSON response standard + CORS
 */
function json(
  body: unknown,
  request: Request,
  env: Env,
  status = 200,
  extraHeaders?: HeadersInit
): Response {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...extraHeaders,
  });

  const cors = getCorsHeaders(request, env, "HARD");
  for (const [k, v] of Object.entries(cors)) {
    headers.set(k, v);
  }

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}

/**
 * Input schema — SOLO per questa route
 */
const RegisterInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerUser(
  request: Request,
  env: Env
): Promise<Response> {
  /* =====================
     1️⃣ READ BODY
  ====================== */
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

  /* =====================
     2️⃣ VALIDATE INPUT
  ====================== */
  let input;
  try {
    input = RegisterInputSchema.parse(JSON.parse(raw));
  } catch (err) {
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

  /* =====================
     3️⃣ HASH PASSWORD
  ====================== */
  const hashBuf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  );

  const passwordHash = [...new Uint8Array(hashBuf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  /* =====================
     4️⃣ BUILD IDENTITY
  ====================== */
  const identity = mapPasswordLogin(
    email
  );

  /* =====================
     5️⃣ CREATE USER
  ====================== */
  const { userId, isNew } = await createUser(
    env,
    identity,
    {passwordHash}
  );

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

  /* =====================
     6️⃣ CREATE SESSION
  ====================== */
  const cookie = buildSessionCookie(
    env,
    userId,
    request
  );

  /* =====================
     7️⃣ RESPONSE
  ====================== */
  return json(
    {
      ok: true,
      userId,
      membershipLevel: "copper",
      isNew: true,
    },
    request,
    env,
    201,
    { "Set-Cookie": cookie }
  );
}