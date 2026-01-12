// ======================================================
// FE || pages/user/dashboard/business/[id].tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER BUSINESS DETAIL (PASSIVE)
//
// RUOLO:
// - Vista informativa del business
// - SOLO lettura
//
// SOURCE OF TRUTH:
// - Backend (getBusiness)
//
// COSA NON FA (VINCOLANTE):
// - ❌ NON modifica dati
// - ❌ NON naviga al configurator
// - ❌ NON gestisce configurationId
//
// NOTA ARCHITETTURALE:
// - L’entry verso il configurator vive:
//   • nella dashboard list
//   • nella CTA “Riprendi configurazione”
//
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

  const [business, setBusiness] =
    useState<BusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);

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

      <p style={{ opacity: 0.6 }}>
        La configurazione del progetto è gestita dal
        configuratore.
      </p>
    </section>
  );
}
