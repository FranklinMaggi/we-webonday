import { adminFetch } from "./client";

export interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  status: "active" | "suspended";
}

type AdminUsersListResponse = {
  ok: true;
  users: AdminUser[];
};

export async function getAdminUsers() {
  const out = await adminFetch<AdminUser[] | AdminUsersListResponse>("/api/admin/users/list");
  return Array.isArray(out) ? out : out.users;
}
