/**
 * ======================================================
 * AUTH SERVICE — USER RESOLUTION / CREATION
 * ======================================================
 *
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Risolve o crea un utente applicativo partendo
 *   da una AuthIdentity normalizzata
 *
 * SOURCE OF TRUTH:
 * - ON_USERS_KV
 * - Mapping PROVIDER:{provider}:{providerUserId} → userId
 *
 * GARANZIE:
 * - 1 provider identity = 1 userId
 * - Email sempre normalizzata lowercase
 * - UserSchema valida SEMPRE l’output
 *
 * NON FA:
 * - NON crea sessioni
 * - NON imposta cookie
 * - NON autentica richieste HTTP
 *
 * PERCHÉ:
 * - Separare la creazione utente dal concetto di sessione
 * - Consentire login multipli (password / Google)
 * - Preparare future identity (Apple, Magic link, ecc.)
 *
 * NOTA ARCHITETTURALE:
 * - Questo file NON deve MAI dipendere da Request / Response
 * - È puro dominio + persistence
 * ======================================================
 */

import type { AuthIdentity } from "../types";
export function mapGooglePayload(payload: any): AuthIdentity {
    return {
      provider: "google",
      providerUserId: String(payload.sub),
      email: String(payload.email),
      emailVerified: Boolean(payload.email_verified),
      profile: {
        name: payload.name,
        picture: payload.picture,
        locale: payload.locale,
      },
    };
  }
  