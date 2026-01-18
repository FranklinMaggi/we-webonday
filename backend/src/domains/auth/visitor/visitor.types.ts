/**
 * ======================================================
 * VISITOR TYPES
 * ======================================================
 *
 * RUOLO:
 * - Tipi minimi per Visitor (soft identity)
 *
 * NOTE:
 * - NON contiene userId
 * - NON contiene PII
 * - NON rappresenta una sessione
 */

export interface VisitorContext {
    visitorId: string;
    isNew: boolean;
  }
  