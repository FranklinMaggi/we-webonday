/**
 * ======================================================
 * FE || AdminOptionApiModel
 * ======================================================
 *
 * RUOLO:
 * - Shape OPTION lato ADMIN (backend)
 *
 * SOURCE:
 * - Backend /api/admin/option*
 *
 * NOTE:
 * - Monthly only (hard domain rule)
 * ======================================================
 */
export interface AdminOptionApiModel {
    id: string;
    name: string;
    description: string;
    price: number;
    payment: {
      mode: "recurring";
      interval: "monthly";
    };
    status: "ACTIVE" | "ARCHIVED";
  }
  