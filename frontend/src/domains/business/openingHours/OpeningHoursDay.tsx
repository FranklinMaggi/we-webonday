// ======================================================
// FE || components/OpeningHoursDay.tsx
// ======================================================
//
// AI-SUPERCOMMENT — OPENING HOURS DAY
//
// RUOLO:
// - Gestisce orari di apertura per UN singolo giorno
// - Supporta flusso sequenziale (wizard)
// - Può propagare il valore al giorno successivo
//
// SOURCE OF TRUTH:
// - openingHours → configurationSetup.store
//
// INVARIANTI:
// - Nessuna fetch
// - Nessuna persistenza backend
// - Salva stringhe normalizzate ("H24", "Chiuso", "09:00 - 18:00", ecc.)
// ======================================================

type OpeningHoursDayProps = {
  dayKey: string;
  dayLabel: string;
  value: string;

  /** true se è il giorno attualmente visibile */
  isActive?: boolean, //default;

  /** aggiorna il valore del giorno corrente */
  onChange: (value: string) => void;

  /**
   * chiamato quando il giorno è "completato"
   * → il parent può:
   *   - mostrare il giorno successivo
   *   - copiare automaticamente il valore
   */
  onAutoNext?: (value: string) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MINUTES = ["00", "15", "30", "45"];

export function OpeningHoursDay({
  dayLabel,
  value,
  isActive,
  onChange,
  onAutoNext,
}: OpeningHoursDayProps) {
  if (!isActive) return null;

  /* =========================
     MODE DERIVATO (UI)
  ========================= */
  const mode: "h24" | "closed" | "single" | "split" =
    value === "H24"
      ? "h24"
      : value === "Chiuso"
      ? "closed"
      : value.includes("/")
      ? "split"
      : "single";

  const isSingle = mode === "single";
  const isSplit = mode === "split";

  function commit(value: string) {
    onChange(value);
    onAutoNext?.(value);
  }

  return (
    <div className="opening-day">
      <strong>{dayLabel}</strong>

      {/* ================= PRESET ================= */}
      <div className="opening-presets">
        <button type="button" onClick={() => commit("H24")}>
          H24
        </button>

        <button type="button" onClick={() => commit("Chiuso")}>
          Chiuso
        </button>

        <button
          type="button"
          onClick={() => commit("09:00 - 18:00")}
        >
          Orario unico
        </button>

        <button
          type="button"
          onClick={() =>
            commit("09:00 - 13:00 / 16:00 - 20:00")
          }
        >
          Doppio turno
        </button>
      </div>

      {/* ================= ORARIO SINGOLO ================= */}
      {isSingle && (
        <div className="time-row">
          <TimeRange
            value={value}
            onChange={commit}
          />
        </div>
      )}

      {/* ================= DOPPIO TURNO ================= */}
      {isSplit && (() => {
        const [morning, afternoon] = value.split(" / ");

        return (
          <>
            <div className="time-row">
              <em>Mattina</em>
              <TimeRange
                value={morning}
                onChange={(v) =>
                  commit(`${v} / ${afternoon}`)
                }
              />
            </div>

            <div className="time-row">
              <em>Pomeriggio</em>
              <TimeRange
                value={afternoon}
                onChange={(v) =>
                  commit(`${morning} / ${v}`)
                }
              />
            </div>
          </>
        );
      })()}
    </div>
  );
}

/* ======================================================
   SUBCOMPONENT — TIME RANGE (CONTROLLATO)
====================================================== */

type TimeTuple = {
  fromH: string;
  fromM: string;
  toH: string;
  toM: string;
};

function parseRange(range: string): TimeTuple {
  const [from, to] = range.split(" - ");
  const [fromH, fromM] = from.split(":");
  const [toH, toM] = to.split(":");
  return { fromH, fromM, toH, toM };
}

function composeRange(t: TimeTuple) {
  return `${t.fromH}:${t.fromM} - ${t.toH}:${t.toM}`;
}

type TimeRangeProps = {
  value: string;
  onChange: (value: string) => void;
};

function TimeRange({ value, onChange }: TimeRangeProps) {
  const time = parseRange(value);

  function update(part: Partial<TimeTuple>) {
    onChange(
      composeRange({
        ...time,
        ...part,
      })
    );
  }

  return (
    <>
      <select value={time.fromH} onChange={(e) => update({ fromH: e.target.value })}>
        {HOURS.map((h) => <option key={h}>{h}</option>)}
      </select>
      :
      <select value={time.fromM} onChange={(e) => update({ fromM: e.target.value })}>
        {MINUTES.map((m) => <option key={m}>{m}</option>)}
      </select>

      <span>—</span>

      <select value={time.toH} onChange={(e) => update({ toH: e.target.value })}>
        {HOURS.map((h) => <option key={h}>{h}</option>)}
      </select>
      :
      <select value={time.toM} onChange={(e) => update({ toM: e.target.value })}>
        {MINUTES.map((m) => <option key={m}>{m}</option>)}
      </select>
    </>
  );
}
