// ======================================================
// FE || ADMIN API — CONFIGURATIONS
// ======================================================

import { adminFetch } from "./client";

/* =========================
   TYPES
========================= */
export type AdminConfiguration = {
  id: string;
  status: string;
  userId: string;
  businessDraftId?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt?: string;
};

/* =========================
   LIST ✅ (FIX)
========================= */
export function getAdminConfigurationsList() {
  return adminFetch<{
    ok: true;
    configurations: AdminConfiguration[];
  }>("/api/admin/configurations/list"); // ✅ PLURAL
}

/* =========================
   DETAIL (OPZIONALE, PULITO)
========================= */
export function getAdminConfigurationDetail(configurationId: string) {
  return adminFetch<{
    ok: true;
    configuration: AdminConfiguration;
    owner: any | null;
    business: any | null;
  }>(`/api/admin/configuration?id=${configurationId}`);
}

/* =========================
   ACTIONS
========================= */
export function acceptAdminConfiguration(configurationId: string) {
  return adminFetch("/api/admin/configuration/accept", {
    method: "POST",
    body: JSON.stringify({ configurationId }),
  });
}

export function rejectAdminConfiguration(
  configurationId: string,
  reason?: string
) {
  return adminFetch("/api/admin/configuration/reject", {
    method: "POST",
    body: JSON.stringify({ configurationId, reason }),
  });
}
