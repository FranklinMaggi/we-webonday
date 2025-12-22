import { useEffect, useState } from "react";
import { getMyBusiness } from "../../lib/businessApi";
import type { BusinessDTO } from "../../lib/dto/businessDTO";
import { useAuthStore } from "../../store/auth.store";

export default function BusinessDashboard() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  const [business, setBusiness] = useState<BusinessDTO | null>(null);
  const [loadingBusiness, setLoadingBusiness] = useState(true);

  // ⛔️ Aspetta bootstrap auth
  useEffect(() => {
    if (!ready || !user) {
      setLoadingBusiness(false);
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
        if (alive) setLoadingBusiness(false);
      });

    return () => {
      alive = false;
    };
  }, [ready, user]);

  // ⏳ Attesa bootstrap + business
  if (!ready || loadingBusiness) return null;

  // ⛔️ Sicurezza (non dovrebbe mai accadere se usi BusinessGuard)
  if (!user || !business) return null;

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
