/**
 * ======================================================
 * AUTH PROVIDER — PASSWORD
 * ======================================================
 *
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Normalizzare un login password-based in AuthIdentity
 *
 * INVARIANTI:
 * - provider = "password"
 * - providerUserId = passwordHash (NON la password in chiaro)
 * - email sempre normalizzata lowercase
 *
 * SICUREZZA:
 * - passwordHash è già derivato (hash sicuro)
 * - NON viene mai esposto al frontend
 * - NON viene mai usato come identificatore pubblico
 *
 * NON FA:
 * - NON verifica la password (già fatto prima)
 * - NON crea utenti
 * - NON imposta sessioni
 *
 * PERCHÉ:
 * - Uniformare password e OAuth sotto lo stesso flusso
 * - Evitare pipeline separate
 * ======================================================
 */

import type { AuthIdentity } from "../types";
export function mapPasswordLogin(
    email: string,
    passwordHash: string
  ): AuthIdentity {
    return {
      provider: "password",
      providerUserId: passwordHash,
      email: email.toLowerCase(),
      emailVerified: true,
    };
  }
  