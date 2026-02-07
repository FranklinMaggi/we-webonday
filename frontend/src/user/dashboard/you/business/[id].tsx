// ======================================================
// FE || pages/user/dashboard/business/[id].tsx
// ======================================================

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../shared/lib/api";
import type { BusinessReadDTO } from "@src/shared/domain/business/buseinssRead.types";
import type { OpeningHoursFE, DayKey } from "@src/shared/domain/business/openingHours.types";
import { DAYS_ORDER, DAY_LABELS, EMPTY_OPENING_HOURS } from "@src/shared/domain/business/openingHours.constants";


export default function UserBusinessDetail() {
  const { id: configurationId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [business, setBusiness] =
    useState<BusinessReadDTO | null>(null);

  const [loading, setLoading] = useState(true);

  /* =====================
     LOAD BUSINESS DRAFT
  ====================== */
  useEffect(() => {
    if (!configurationId) return;

    setLoading(true);

    apiFetch<{ ok: boolean; draft?: BusinessReadDTO }>(
      `/api/business/get?configurationId=${configurationId}`
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

  /* =====================
     SAFE ACCESS
  ====================== */
  const address = business.address ?? {};
  const contact = business.contact ?? {};
  const opening: OpeningHoursFE =
  (business.openingHours as OpeningHoursFE) ?? EMPTY_OPENING_HOURS;

  /* =====================
     RENDER
  ====================== */
  return (
    <main className="business-page">
      {/* HEADER */}
      <header className="business-page__header">
        <h1>{business.businessName}</h1>

      
      </header>

      <hr />

      {/* INDIRIZZO */}
      <section>
        <h2>Indirizzo</h2>
        <p>
          {address.street ?? "—"} {address.number ?? ""}
        </p>
        <p>
          {address.zip ?? ""} {address.city ?? ""}{" "}
          {address.province ?? ""}
        </p>
      </section>

      {/* CONTATTI */}
      <section>
        <h2>Contatti</h2>
        <p>
          <strong>Telefono:</strong>{" "}
          {contact.phoneNumber ?? "—"}
        </p>
        <p>
          <strong>Email:</strong> {contact.mail ?? "—"}
        </p>
      </section>

      {/* ORARI */}
      <section>
  <h2>Orari di apertura</h2>

  {DAYS_ORDER.every((day) => opening[day].length === 0) ? (
    <p>Orari non disponibili</p>
  ) : (
    <ul>
      {DAYS_ORDER.map((day: DayKey) => {
        const slots = opening[day];

        return (
          <li key={day}>
            <strong>{DAY_LABELS[day]}:</strong>{" "}
            {slots.length > 0
              ? slots.map((s, i) => (
                  <span key={i}>
                    {s.from}–{s.to}
                    {i < slots.length - 1 ? ", " : ""}
                  </span>
                ))
              : "Chiuso"}
          </li>
        );
      })}
    </ul>
  )}
</section>

      <hr />

      {/* ACTIONS */}
      <button
        onClick={async () => {
          await apiFetch("/api/business/reopen-draft", {
            method: "POST",
            body: JSON.stringify({ configurationId }),
          });
          navigate(`/user/dashboard/configurator/${configurationId}` );
          navigate(0); // Da non fare?? : 🔄 forza reload della route-> OTTIMA SCELTA FARLO 
        }}>
        ✏️ Riapri Configuazione 
      </button>
    { /**
     * TODO: nel BE chiama reopen-draft 
    */}





    </main>
  );
}
