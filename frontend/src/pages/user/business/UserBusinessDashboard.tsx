import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { getMyBusiness } from "../../../lib/businessApi";
import RegisterBusiness from "./RegisterBusiness";
import MenuUpload from "./MenuUpload";
import type { BusinessDTO } from "../../../lib/dto/businessDTO";

export default function UserBusinessDashboard() {
  const { user, loading } = useCurrentUser();
  const [business, setBusiness] = useState<BusinessDTO | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getMyBusiness(user.id)
    .then((res) => {
      if (!res || !res.ok) {
        setBusiness(null);
        return;
      }
      setBusiness(res.business);
    })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/user/login" replace />;

  if (!business) {
    return <RegisterBusiness />;
  }

  if (business.status === "active") {
    return <Navigate to="/business/dashboard" replace />;
  }

  return (
    <MenuUpload
      business={business}
      onUploaded={(updated) => setBusiness(updated)}
    />
  );
}

