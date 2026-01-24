/* ======================================================
   FE || UI NORMALIZER — STATUS → WD-STATUS
   ====================================================== */

   const STATUS_CLASS_MAP: Record<string, string> = {
    draft: "draft",
    active: "active",
    pending: "pending",
    confirmed: "active",
    processed: "active",
    completed: "active",
    archived: "archived",
    deleted: "error",
    cancelled: "error",
    suspended: "disabled",
  };
  
  export function getWdStatusClass(status?: string) {
    const key = status?.toLowerCase() ?? "draft";
    return `wd-status wd-status--${STATUS_CLASS_MAP[key] ?? "draft"}`;
  }
  