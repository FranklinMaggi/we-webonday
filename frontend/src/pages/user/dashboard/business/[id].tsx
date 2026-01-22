// ======================================================
// FE || pages/user/dashboard/business/[id].tsx
// ======================================================
//
// RUOLO:
// - Vista informativa del Business (READ ONLY)
// - Mini sito / business page privata
//
// SOURCE OF TRUTH:
// - BusinessDraft (BE)
//
// INVARIANTI:
// - Nessuna modifica dati
// - Nessun redirect al configurator
//
// ======================================================

import { useParams , useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api";

export default function UserBusinessDetail() {
  const { id: configurationId } = useParams<{ id: string }>();

  const [business, setBusiness] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  /* =====================
     LOAD BUSINESS DRAFT
  ====================== */
  useEffect(() => {
    if (!configurationId) return;
  

    setLoading(true);

    apiFetch<{ ok: boolean; draft?: any }>(
      `/api/business/get-base-draft?configurationId=${configurationId}`
    )
      .then((res) => {
        if (res?.ok && res.draft) {
          setBusiness(res.draft);
        } else {
          setBusiness(null);
        }
      })
      .finally(() => setLoading(false));
  }, [configurationId]);

  /* =====================
     UI STATES
  ====================== */
  if (!configurationId) return <p>ID mancante</p>;
  if (loading) return <p>Caricamento…</p>;
  if (!business) return <p>Attività non trovata</p>;

  const contact = business.contact ?? {};
  const address = contact.address ?? {};
  const opening = business.businessOpeningHour ?? {};

  /* =====================
     RENDER
  ====================== */
  return (
    <main className="business-page">

      {/* =====================
         HEADER
      ====================== */}
      <header className="business-page__header">
        <h1 className="business-page__title">
          {business.businessName ?? "Attività"}
        </h1>

        <span
          className={`business-page__status ${
            business.complete ? "is-complete" : "is-draft"
          }`}
        >
          {business.complete ? "Business attivo" : "In configurazione"}
        </span>
      </header>

      <hr />

      {/* =====================
         INDIRIZZO
      ====================== */}
      <section className="business-page__section">
        <h2>Indirizzo</h2>

        <p>
          {address.street ?? "—"}
        </p>

        <p>
          {address.zip ?? ""}{" "}
          {address.city ?? ""}{" "}
          {address.province ?? ""}
        </p>
      </section>

      {/* =====================
         CONTATTI
      ====================== */}
      <section className="business-page__section">
        <h2>Contatti</h2>

        <p>
          <strong>Telefono:</strong>{" "}
          {contact.phoneNumber ?? "—"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {contact.mail ?? "—"}
        </p>
      </section>

      {/* =====================
         ORARI
      ====================== */}
      <section className="business-page__section">
        <h2>Orari di apertura</h2>

        {Object.keys(opening).length > 0 ? (
          <ul className="business-page__hours">
            {Object.entries(opening).map(([day, hours]) => (
              <li key={day}>
                <strong>{day}:</strong>{" "}
                {hours as string}
              </li>
            ))}
          </ul>
        ) : (
          <p>Orari non disponibili</p>
        )}
      </section>

      <hr />
      <div style={{ marginTop: "2rem" }}>
  <button
    className="wd-btn-primary"
    onClick={async () => {
      // opzionale: endpoint BE per riportare a DRAFT
      await apiFetch("/api/configuration/set-draft", {
        method: "POST",
        body: JSON.stringify({ configurationId }),
      });

      navigate(`/user/dashboard/workspace/${configurationId}`);
    }}
  >
    ✏️ Modifica sito
  </button>
</div>

      {/* =====================
         FOOTER NOTE
      ====================== */}
      <footer className="business-page__footer">
        <p>
          Questa è una vista informativa dell’attività.
          La modifica del sito avviene dal workspace.
        </p>
      </footer>

    </main>
  );
}
