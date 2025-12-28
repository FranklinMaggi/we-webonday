// src/lib/adminApi/activity.ts
import { adminFetch } from "./client";




// src/lib/adminApi/activity.ts
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