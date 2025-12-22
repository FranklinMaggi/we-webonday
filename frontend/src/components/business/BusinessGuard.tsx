import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getMyBusiness } from "../../lib/businessApi";
import { useUserMode } from "../../lib/userModeStore";
import type { BusinessDTO } from "../../lib/dto/businessDTO";

interface Props {
  children: React.ReactElement;
}

export default function BusinessGuard({ children }: Props) {
  const { user, loading: userLoading } = useCurrentUser();
  const { mode } = useUserMode();

  const [business, setBusiness] = useState<BusinessDTO | null>(null);
  const [businessLoading, setBusinessLoading] = useState(true);

  // ===============================
  // Fetch business solo se serve
  // ===============================
  useEffect(() => {
    if (!user || mode !== "partner") {
      setBusinessLoading(false);
      setBusiness(null);
      return;
    }

    let alive = true;

    getMyBusiness(user.id)
      .then((res) => {
        if (!alive) return;

        if (!res || !res.ok) {
          setBusiness(null);
          return;
        }

        setBusiness(res.business);
      })
      .finally(() => {
        if (alive) setBusinessLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [user, mode]);

  // ===============================
  // Stato di caricamento
  // ===============================
  if (userLoading || businessLoading) {
    return null; // oppure spinner globale
  }

  // ===============================
  // Guardie in ordine logico
  // ===============================

  // 1️⃣ Non loggato
  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  // 2️⃣ Loggato ma non Partner
  if (mode !== "partner") {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Partner senza business
  if (!business) {
    return <Navigate to="/user/business/register" replace />;
  }

  // 4️⃣ Business in bozza → onboarding
  if (business.status === "draft") {
    return <Navigate to="/user/business/upload-menu" replace />;
  }

  // 5️⃣ Tutto ok → dashboard
  return children;
}
