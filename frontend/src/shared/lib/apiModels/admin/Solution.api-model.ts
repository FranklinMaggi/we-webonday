/**
 * ======================================================
 * FE || AdminSolution — API MODEL
 * ======================================================
 *
 * RUOLO:
 * - Shape Solution lato ADMIN (backend-aligned)
 *
 * USATO DA:
 * - admin.solutions.api
 * - admin.solution.editor.api (list)
 *
 * SOURCE:
 * - Backend (source of truth)
 * ======================================================
 */

export type SolutionStatus =
  | "DRAFT"
  | "ACTIVE"
  | "ARCHIVED";

export type AdminSolution = {
  id: string;
  name: string;
  description: string;
  status: SolutionStatus;
  createdAt: string;
  updatedAt?: string;
};

export type AdminSolutionsResponse = {
  ok: true;
  solutions: AdminSolution[];
};
