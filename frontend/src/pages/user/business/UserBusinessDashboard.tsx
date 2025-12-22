import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth.store";
import { getMyBusiness } from "../../../lib/businessApi";
import RegisterBusiness from "./RegisterBusiness";
import MenuUpload from "./MenuUpload";
import type { BusinessDTO } from "../../../lib/dto/businessDTO";

export default function UserBusinessDashboard() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  const [business, setBusiness] = useState<BusinessDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth bootstrap guard
  useEffect(() => {
    if (!ready) return;

    if (!user) {
      setLoading(false);
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
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [ready, user]);

  // ⏳ Attendi bootstrap auth + fetch business
  if (!ready || loading) return null;

  // 🚫 Non loggato
  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  // 🆕 Nessun business → registrazione
  if (!business) {
    return <RegisterBusiness />;
  }

  // ✅ Business attivo → dashboard
  if (business.status === "active") {
    return <Navigate to="/business/dashboard" replace />;
  }

  // ⏳ Draft / Pending → upload menu
  return (
    <MenuUpload
      business={business}
      onUploaded={(updated) => setBusiness(updated)}
    />
  );
}
