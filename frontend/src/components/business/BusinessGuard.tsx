import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyBusiness } from "../../lib/businessApi";
import { useUserMode } from "../../lib/userModeStore";
import type { BusinessDTO } from "../../lib/dto/businessDTO";
import { useAuthStore } from "../../store/auth.store";

interface Props {
  children: React.ReactElement;
}

export default function BusinessGuard({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const { mode } = useUserMode();

  const [business, setBusiness] = useState<BusinessDTO | null>(null);
  const [businessLoading, setBusinessLoading] = useState(true);

  // ⛔️ Aspetta bootstrap auth
  if (!ready) return null;

  // ⛔️ Non loggato
  if (!user) return <Navigate to="/user/login" replace />;

  // ===============================
  // Fetch business SOLO se partner
  // ===============================
  useEffect(() => {
    if (mode !== "partner") {
      setBusiness(null);
      setBusinessLoading(false);
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
  }, [user.id, mode]);

  // ⏳ Attesa business
  if (businessLoading) return null;

  // ===============================
  // GUARDIE IN ORDINE LOGICO
  // ===============================

  // 1️⃣ Loggato ma NON partner
  if (mode !== "partner") {
    return <Navigate to="/" replace />;
  }

  // 2️⃣ Partner senza business
  if (!business) {
    return <Navigate to="/user/business/register" replace />;
  }

  // 3️⃣ Business in bozza
  if (business.status === "draft") {
    return <Navigate to="/user/business/upload-menu" replace />;
  }

  // 4️⃣ OK → dashboard
  return children;
}
