// ======================================================
// FE || components/OpeningHoursDay.tsx
// ======================================================
//
// AI-SUPERCOMMENT — OPENING HOURS DAY (HARDENED)
//
// RUOLO:
// - Gestisce orari di apertura per UN singolo giorno
// - UX a preset + modifica fine
// - Sicuro contro valori vuoti / parziali
//
// SOURCE OF TRUTH:
// - configurationSetup.store (openingHours)
//
// INVARIANTI:
// - Nessuna fetch
// - Nessuna persistenza backend
// - Accetta SOLO stringhe normalizzate
// ======================================================

type OpeningHoursDayProps = {
  dayKey: string;
  dayLabel: string;

  /** valore corrente (stringa normalizzata o vuota) */
  value?: string;

  /** se false, il giorno non viene renderizzato */
  isActive?: boolean;

  /** aggiorna il valore del giorno */
  onChange: (value: string) => void;

  /** opzionale: avanzamento automatico wizard */
  onAutoNext?: (value: string) => void;
};

/* ======================================================
   COSTANTI
====================================================== */

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MINUTES = ["00", "15", "30", "45"];

/* ======================================================
   COMPONENT
====================================================== */

export function OpeningHoursDay({
  dayLabel,
  value,
  isActive = true,
  onChange,
  onAutoNext,
}: OpeningHoursDayProps) {
  if (!isActive) return null;

  const safeValue = value?.trim() ?? "";

  /* ======================================================
     MODE DERIVATION (SAFE)
  ====================================================== */
  const mode: "empty" | "h24" | "closed" | "single" | "split" =
    !safeValue
      ? "empty"
      : safeValue === "H24"
      ? "h24"
      : safeValue === "Chiuso"
      ? "closed"
      : safeValue.includes("/")
      ? "split"
      : safeValue.includes(" - ")
      ? "single"
      : "empty";

  function commit(next: string) {
    onChange(next);
    onAutoNext?.(next);
  }

  /* ======================================================
     RENDER
  ====================================================== */
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
      {mode === "single" && (
        <div className="time-row">
          <TimeRange
            value={safeValue}
            onChange={commit}
          />
        </div>
      )}

      {/* ================= DOPPIO TURNO ================= */}
      {mode === "split" && (() => {
        const [morning, afternoon] = safeValue.split(" / ");

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
   SUBCOMPONENT — TIME RANGE (SAFE)
====================================================== */

type TimeTuple = {
  fromH: string;
  fromM: string;
  toH: string;
  toM: string;
};

function parseRange(range: string): TimeTuple {
  // 🔒 fallback assoluto
  if (!range || !range.includes(" - ")) {
    return {
      fromH: "09",
      fromM: "00",
      toH: "18",
      toM: "00",
    };
  }

  const [from, to] = range.split(" - ");
  const [fromH, fromM] = from.split(":");
  const [toH, toM] = to.split(":");

  return {
    fromH: fromH ?? "09",
    fromM: fromM ?? "00",
    toH: toH ?? "18",
    toM: toM ?? "00",
  };
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
    <div className="time-range">
      <select
        value={time.fromH}
        onChange={(e) =>
          update({ fromH: e.target.value })
        }
      >
        {HOURS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      :

      <select
        value={time.fromM}
        onChange={(e) =>
          update({ fromM: e.target.value })
        }
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <span> — </span>

      <select
        value={time.toH}
        onChange={(e) =>
          update({ toH: e.target.value })
        }
      >
        {HOURS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      :

      <select
        value={time.toM}
        onChange={(e) =>
          update({ toM: e.target.value })
        }
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}
