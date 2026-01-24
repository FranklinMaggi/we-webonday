/**
 * ======================================================
 * FE || Solution — API RESPONSES
 * ======================================================
 *
 * RUOLO:
 * - Union response per endpoint admin solution
 * ======================================================
 */

import type { SolutionEditorDTO } from "./SolutionEditor.view-model";

export type AdminSolutionDetailResponse =
  | {
      ok: true;
      solution: SolutionEditorDTO;
    }
  | {
      ok: false;
      error: string;
    };
