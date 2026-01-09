// ======================================================
// FE || components/OpeningHoursDay.tsx
// ======================================================
//
// AI-SUPERCOMMENT — OPENING HOURS DAY
//
// RUOLO:
// - Gestisce orari di apertura per UN singolo giorno
// - UI dichiarativa, FE-only
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
    onChange: (value: string) => void;
  };
  
  const HOURS = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const MINUTES = ["00", "15", "30", "45"];
  
  export function OpeningHoursDay({
    dayLabel,
    value,
    onChange,
  }: OpeningHoursDayProps) {
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
  
    const isH24 = mode === "h24";
    const isClosed = mode === "closed";
    const isSingle = mode === "single";
    const isSplit = mode === "split";
  
    return (
      <div className="opening-day">
        <strong>{dayLabel}</strong>
  
        {/* ================= PRESET ================= */}
        <div className="opening-presets">
          <button
            type="button"
            className={isH24 ? "preset active" : "preset"}
            onClick={() => onChange("H24")}
          >
            H24
          </button>
  
          <button
            type="button"
            className={isClosed ? "preset active" : "preset"}
            onClick={() => onChange("Chiuso")}
          >
            Chiuso
          </button>
  
          <button
            type="button"
            className={isSingle ? "preset active" : "preset"}
            onClick={() => onChange("09:00 - 18:00")}
          >
            Orario unico
          </button>
  
          <button
            type="button"
            className={isSplit ? "preset active" : "preset"}
            onClick={() =>
              onChange("09:00 - 13:00 / 16:00 - 20:00")
            }
          >
            Doppio turno
          </button>
        </div>
  
        {/* ================= ORARIO SINGOLO ================= */}
        {isSingle && (
          <div className="time-row">
            <TimeRange />
          </div>
        )}
  
        {/* ================= DOPPIO TURNO ================= */}
        {isSplit && (
          <>
            <div className="time-row">
              <em>Mattina</em>
              <TimeRange />
            </div>
  
            <div className="time-row">
              <em>Pomeriggio</em>
              <TimeRange />
            </div>
          </>
        )}
      </div>
    );
  }
  
  /* ======================================================
     SUBCOMPONENT — TIME RANGE (UI ONLY)
  ====================================================== */
  function TimeRange() {
    return (
      <>
        <select>
          {HOURS.map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
        <span>:</span>
        <select>
          {MINUTES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
  
        <span>—</span>
  
        <select>
          {HOURS.map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
        <span>:</span>
        <select>
          {MINUTES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </>
    );
  }
  