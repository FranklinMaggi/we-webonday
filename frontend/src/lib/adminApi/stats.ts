// src/lib/adminApi/stats.ts

import { adminFetch } from "./client";

/* ============================================================
   ADMIN KPI — DTO (ALIGNED WITH BE)
============================================================ */

export interface AdminKPI {
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    processed: number;
    completed: number;
    deleted: number;
  };
  revenue: {
    paidOrders: number;
    totalAmount: number;
  };
  users: {
    total: number;
  };
}

export interface AdminKPIResponse {
  ok: boolean;
  kpi: AdminKPI;
}

export function getAdminKPI() {
  return adminFetch<AdminKPIResponse>("/api/admin/kpi");
}
