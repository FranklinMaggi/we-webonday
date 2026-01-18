/**
 * ======================================================
 * AUTH LIFECYCLE — PASSIVE ORCHESTRATOR
 * ======================================================
 *
 * RUOLO:
 * - Osservare eventi auth già avvenuti
 * - Normalizzare il lifecycle
 * - Centralizzare audit e coerenza
 *
 * NON FA:
 * - NON blocca flussi
 * - NON modifica sessioni
 * - NON tocca cookie
 * - NON lancia eccezioni
 *
 * DESIGN:
 * - Append-only
 * - Fail-safe (mai throw)
 * - Zero coupling HTTP
 * ======================================================
 */

export type AuthLifecycleState =
  | "PAGE_MOUNTED"
  | "VISITOR_SOFT"
  | "USER_CREATED"
  | "SESSION_ACTIVE"
  | "SESSION_CLOSED"
  | "USER_REVOKED";

export type AuthLifecycleEvent =
  | "PAGE_RENDERED"
  | "VISITOR_CREATED"
  | "AUTH_ATTEMPT"
  | "USER_CREATED"
  | "SESSION_CREATED"
  | "SESSION_USED"
  | "SESSION_REVOKED"
  | "USER_DELETED";

export interface AuthLifecycleInput {
  event: AuthLifecycleEvent;
  userId?: string;
  visitorId?: string;
  sessionId?: string; // futuro
  source: "route" | "guard" | "admin";
  meta?: Record<string, unknown>;
}

export interface AuthLifecycleRecord {
  event: AuthLifecycleEvent;
  derivedState: AuthLifecycleState;
  userId?: string;
  timestamp: string;
  consistency: "ok" | "violation";
}

/**
 * Stato derivato (NON persistito)
 */
function deriveState(
  event: AuthLifecycleEvent
): AuthLifecycleState {
  switch (event) {
    case "VISITOR_CREATED":
      return "VISITOR_SOFT";
    case "USER_CREATED":
      return "USER_CREATED";
    case "SESSION_CREATED":
    case "SESSION_USED":
      return "SESSION_ACTIVE";
    case "SESSION_REVOKED":
      return "SESSION_CLOSED";
    case "USER_DELETED":
      return "USER_REVOKED";
    default:
      return "PAGE_MOUNTED";
  }
}

/**
 * Emit passivo — non blocca mai
 */
export function emitAuthLifecycleEvent(
  input: AuthLifecycleInput
): AuthLifecycleRecord {
  const record: AuthLifecycleRecord = {
    event: input.event,
    derivedState: deriveState(input.event),
    userId: input.userId,
    timestamp: new Date().toISOString(),
    consistency: "ok",
  };

  // 🔒 Fail-safe assoluto
  try {
    // Qui in FASE 3: SOLO console / logActivity (opzionale)
    console.log("[AUTH_LIFECYCLE]", record);
  } catch {
    // silenzio assoluto
  }

  return record;
}
