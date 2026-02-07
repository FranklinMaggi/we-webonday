import { listMyBusinesses } from
  "@src/user/editor/business/api/business.list";
import { useEffect, useState } from "react";

export function useSidebarBusinesses() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    listMyBusinesses().then((res) => {
      if (res?.ok && Array.isArray(res.items)) {
        setItems(res.items);
      }
    });
  }, []);

  return items.map((b) => ({
    to: `/user/dashboard/business/${b.businessId}`,

    label:
      b.name ??
      b.displayName ??
      b.businessName ??
      "Attività senza nome",

    status: b.verification, // DRAFT | PENDING | ACCEPTED | REJECTED
    className: "sidebar-link--activity",
    disabled: b.verification === "DRAFT",
  }));
}
