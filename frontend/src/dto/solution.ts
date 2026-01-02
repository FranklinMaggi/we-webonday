// frontend/src/dto/solution.ts

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
// frontend/src/types/solution.ts

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
  
  export type AdminSolutionDetailResponse =
    | {
        ok: true;
        solution: SolutionEditorDTO;
      }
    | {
        ok: false;
        error: string;
      };
  