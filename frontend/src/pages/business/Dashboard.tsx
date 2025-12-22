import { useEffect, useState } from "react";
import { getMyBusiness } from "../../lib/businessApi";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import type { BusinessDTO } from "../../lib/dto/businessDTO";

export default function BusinessDashboard() {
    const { user, loading } = useCurrentUser();
    const [business, setBusiness] = useState<BusinessDTO | null>(null);
  
    useEffect(() => {
      if (!user) return;
  
      getMyBusiness(user.id).then((res) =>{
        if(!res|| !res.ok){
            setBusiness(null);
        return;}
        setBusiness(res.business);});
    }, [user]);
  
    if (loading) return null;
    if (!user) return null;
    if (!business) return null;
  
    return (
      <div className="dashboard">
        <h1>{business.name}</h1>
  
        <section>
          <p><strong>Indirizzo:</strong> {business.address}</p>
          <p><strong>Telefono:</strong> {business.phone}</p>
          <p><strong>Stato:</strong> {business.status}</p>
        </section>
  
        {business.menuPdfUrl && (
          <section>
            <h3>Menù</h3>
            <a href={business.menuPdfUrl} target="_blank" rel="noreferrer">
              Apri PDF
            </a>
          </section>
        )}
      </div>
    );
  }
  