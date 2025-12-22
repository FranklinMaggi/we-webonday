import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getMyBusiness } from "../../lib/businessApi";
import type { BusinessDTO } from "../../lib/dto/businessDTO";

interface Props {
  children: React.ReactElement;
}

export default function BusinessGuard({ children }: Props) {
  const { user, loading: userLoading } = useCurrentUser();
  const [business, setBusiness] = useState<BusinessDTO | null>(null);
  const [loading, setLoading] = useState(true);

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
  

  if (userLoading || loading) return null;
  if (!user) return <Navigate to="/user/login" replace />;
  if (!business) return <Navigate to="/user/business/register" replace />;
  if (business.status === "draft")
    return <Navigate to="/user/business/upload-menu" replace />;

  return children;
}
