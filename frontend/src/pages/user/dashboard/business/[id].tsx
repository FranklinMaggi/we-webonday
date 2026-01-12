// ======================================================
// FE || pages/user/dashboard/business/[id].tsx
// ======================================================
//
// USER BUSINESS DETAIL (READ-ONLY)
//
// RUOLO:
// - Vista informativa attività
// - Ponte verso configurator
//
// SOURCE OF TRUTH:
// - Backend (getBusiness)
//
// COSA NON FA:
// - NON modifica dati
// - NON usa store FE
// - NON gestisce configurazione
// ======================================================
// ======================================================
// FE || pages/user/dashboard/business/[id].tsx
// ======================================================
//
// USER BUSINESS DETAIL (PASSIVE VIEW)
//
// RUOLO:
// - Vista passiva del business
// - Solo lettura (no configurazione)
// - Entry point verso configurator
//
// INVARIANTI:
// - Nessuna mutazione
// - Backend = source of truth
// ======================================================

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBusiness } from "../../../../lib/userApi/business.user.api";

type BusinessDetail = {
    id: string;
    name: string;
    status: string;
    address: string;
    phone: string;
  };

  
export default function UserBusinessDetail() {
  const { id } = useParams<{ id: string }>();

  const [business, setBusiness] = useState<BusinessDetail | null>(null);const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getBusiness(id)
    .then((res) => {
      setBusiness(res.business);
    })
    .catch(() => {
      setBusiness(null);
    })
    .finally(() => setLoading(false));
  
  }, [id]);

  if (!id) return <p>ID business mancante</p>;
  if (loading) return <p>Caricamento…</p>;
  if (!business) return <p>Business non trovato</p>;

  return (
    <section>
      <h2>{business.name}</h2>
      <p>Stato: {business.status}</p>
      <p>Indirizzo: {business.address}</p>
      <p>Telefono: {business.phone}</p>

      <hr />

      <button
  onClick={() => alert("Flusso configurazione in aggiornamento")}
>
  ✏️ Configurazione
</button>

      
    </section>
  );
}
