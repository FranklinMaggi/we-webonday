import { listMyBusinesses } from "@src/user/editor/business/api/business.list";
import { useEffect, useState } from "react";
import { useWorkspaceState } from "@src/user/site-engine/workspace/workspace.state";
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
import { useNavigate } from "react-router-dom";
export function useSidebarBusinessesPreview() {
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const { setActiveConfiguration } = useWorkspaceState();
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
           // TEMPORANEO: businessId === configurationId
      setActiveConfiguration(b.businessId);
      navigate(`/user/dashboard/workspace/${b.businessId}`)
      },
    }));
}








{/** onClick: () => {
        window.open(
          `https://${b.publicId}.webonday.it`,
          "_blank"
        );
      },
    })); */}