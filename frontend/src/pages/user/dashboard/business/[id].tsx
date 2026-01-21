// ======================================================
// FE || pages/user/dashboard/business/[id].tsx
// ======================================================

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api";

export default function UserBusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    apiFetch<{ ok: boolean; business: any }>(
      `/api/business/draft/get?id=${id}`,
      { method: "GET" }
    )
      .then((res) => {
        if (res?.ok) setBusiness(res.business);
        else setBusiness(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) return <p>ID mancante</p>;
  if (loading) return <p>Caricamento…</p>;
  if (!business) return <p>Attività non trovata</p>;

  return (
    <section>
      <h2>{business.businessName}</h2>

      <p>Telefono: {business.contact?.phoneNumber}</p>
      <p>Email: {business.contact?.mail}</p>
      <p>Indirizzo: {business.contact?.address?.street}</p>

      <hr />

      <p style={{ opacity: 0.6 }}>
        Questa è una vista informativa dell’attività.
        La modifica del sito avviene dal workspace.
      </p>
    </section>
  );
}
