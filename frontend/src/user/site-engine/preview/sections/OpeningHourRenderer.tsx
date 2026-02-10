// ======================================================
// FE || WEBY DEV ENGINE — OPENING HOURS RENDERER
// ======================================================
//
// RUOLO:
// - Renderizza gli orari di apertura nel sito preview / pubblico
// - Consuma OpeningHoursFE (dominio Business)
//
// SOURCE OF TRUTH:
// - OpeningHoursFE (BE → FE)
//
// INVARIANTI:
// - Nessuna configurazione
// - Nessuna mutazione
// - Nessuna persistenza
// - Render puro
// ======================================================

import type {
  OpeningHoursFE,
  TimeRangeFE,
} from "@shared/domain/business/openingHours.types";

/* =====================
   DAY ORDER & LABELS
===================== */
type DayKey = keyof OpeningHoursFE;

const DAY_ORDER: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS: Record<DayKey, string> = {
  monday: "Lunedì",
  tuesday: "Martedì",
  wednesday: "Mercoledì",
  thursday: "Giovedì",
  friday: "Venerdì",
  saturday: "Sabato",
  sunday: "Domenica",
};

/* =====================
   PROPS
===================== */
type Props = {
  openingHours: OpeningHoursFE;
};

/* =====================
   RENDERER
===================== */
export function OpeningHoursRenderer({
  openingHours,
}: Props) {
  if (!openingHours) return null;

  return (
    <section id="orari"   className="opening-hours">
      <h3>Orari di apertura</h3>

      <ul className="opening-hours-list">
        {DAY_ORDER.map((day) => {
          const ranges = openingHours[day];
          if (!ranges) return null;

          return (
            <li key={day} className="opening-hours-row">
              <span className="day-label">
                {DAY_LABELS[day]}
              </span>

              <span className="day-hours">
                {renderHours(ranges)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* =====================
   UI HELPERS (VISUAL)
===================== */
function renderHours(ranges: TimeRangeFE[]) {
  if (!ranges || ranges.length === 0) {
    return <span className="badge closed">Chiuso</span>;
  }

  // H24 convenzione: un solo range 00:00 → 24:00
  if (
    ranges.length === 1 &&
    ranges[0].from === "00:00" &&
    ranges[0].to === "24:00"
  ) {
    return <span className="badge h24">Aperto 24h</span>;
  }

  // Uno o più turni
  return (
    <span className="split-hours">
      {ranges.map((r, i) => (
        <span key={i}>
          {r.from} – {r.to}
          {i < ranges.length - 1 && (
            <span className="separator"> / </span>
          )}
        </span>
      ))}
    </span>
  );
}