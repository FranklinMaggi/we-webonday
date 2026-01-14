// ======================================================
// FE || components/webyDevEngine/sections/OpeningHourRenderer.tsx
// ======================================================
//
// AI-SUPERCOMMENT — OPENING HOUR RENDERER
//
// RUOLO:
// - Renderizza gli orari di apertura nel sito preview / pubblico
// - Consuma i dati dal dominio Business
//
// SOURCE OF TRUTH:
// - business.businessHours (BE → FE)
//
// INVARIANTI:
// - Nessuna configurazione
// - Nessuna modifica
// - Nessuna persistenza
// - FE-only, render puro
//
// COSA FA:
// - Mostra giorni + orari
// - Gestisce: H24, Chiuso, singolo turno, doppio turno
//
// COSA NON FA:
// - NON salva
// - NON legge store
// - NON usa configuration
// ======================================================

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type BusinessHours = Record<DayKey, string>;

type OpeningHourRendererProps = {
  openingHours: BusinessHours;
};

const DAY_LABELS: Record<DayKey, string> = {
  monday: "Lunedì",
  tuesday: "Martedì",
  wednesday: "Mercoledì",
  thursday: "Giovedì",
  friday: "Venerdì",
  saturday: "Sabato",
  sunday: "Domenica",
};

const DAY_ORDER: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function OpeningHourRenderer({
  openingHours,
}: OpeningHourRendererProps) {
  if (!openingHours) return null;

  return (
    <section className="opening-hours">
      <h3>Orari di apertura</h3>

      <ul className="opening-hours-list">
        {DAY_ORDER.map((dayKey) => {
          const value = openingHours[dayKey];

          if (!value) return null;

          return (
            <li key={dayKey} className="opening-hours-row">
              <span className="day-label">
                {DAY_LABELS[dayKey]}
              </span>

              <span className="day-hours">
                {renderHours(value)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ======================================================
   UI HELPERS — VISUAL ONLY
====================================================== */

function renderHours(value: string) {
  if (value === "Chiuso") {
    return <span className="badge closed">Chiuso</span>;
  }

  if (value === "H24") {
    return <span className="badge h24">Aperto 24h</span>;
  }

  if (value.includes("/")) {
    const [morning, afternoon] = value.split(" / ");
    return (
      <span className="split-hours">
        <span>{morning}</span>
        <span className="separator"> / </span>
        <span>{afternoon}</span>
      </span>
    );
  }

  return <span>{value}</span>;
}
