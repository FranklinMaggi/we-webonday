/**
 * ======================================================
 * FE || SolutionEditor — VIEW MODEL
 * ======================================================
 *
 * RUOLO:
 * - Modello dati usato dall’EDITOR ADMIN
 *
 * NOTE:
 * - UI-first
 * - Può divergere dal backend
 * ======================================================
 */

export type SolutionEditorDTO = {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    status: "DRAFT" | "ACTIVE" | "ARCHIVED";
    icon?: string;
    industries?: string[];
    productIds: string[];
    createdAt: string;
    updatedAt?: string;
  };
  