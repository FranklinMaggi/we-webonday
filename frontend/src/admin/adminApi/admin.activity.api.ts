/**
 * ======================================================
 * FE || src/lib/adminApi/admin.activity.api.ts
 * ======================================================
 *
 * VERSIONE ATTUALE:
 * - v1.0 (2026-01)
 *
 * STATO:
 * - CORE
 *
 * RUOLO:
 * - Esporre il log attività amministrative
 *
 * ...
 */

import { adminFetch } from "./client";




// src/lib/adminApi/admin.activity.api.ts
export interface AdminActivity {
    id: string;
    type: string;
    userId: string | null;
    timestamp: string;
    payload: any;
  }
  
  export function getAdminActivity() {
    return adminFetch<AdminActivity[]>("/api/admin/activity/list");
  }