import { listMyBusinesses } from "@src/user/editor/business/api/business.list";
import { useEffect, useState } from "react";

// ======================================================
// FE || SIDEBAR || SITE PREVIEW (BUSINESS-CENTRIC)
// ======================================================
//
// LOGICA DI DOMINIO:
// - la preview ESISTE se esiste il Business
// - NON dipende da configuration
// - NON dipende da verification
// - NON dipende da complete
//
// REQUISITO MINIMO:
// - identificatore pubblico (publicId)
// ======================================================

export function useSidebarBusinessesPreview() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    listMyBusinesses().then((res) => {
      if (res?.ok && Array.isArray(res.items)) {
        setItems(res.items);
      }
    });
  }, []);

  return items
    .map((b) => ({
      to: "#",

      label: `${b.businessName}.weby`, // dominio SEMPRE visibile
   

    status: b.verification, // DRAFT | PENDING | ACCEPTED | REJECTED
    className: "sidebar-link--activity",
    disabled: b.verification === "DRAFT",
      onClick: () => {
        window.open(
          `https://${b.publicId}.webonday.it`,
          "_blank"
        );
      },
    }));
}
