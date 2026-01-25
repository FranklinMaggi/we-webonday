// ======================================================
// FE || components/OpeningHoursDay.tsx
// ======================================================
//
// RUOLO:
// - Gestisce orari di apertura per UN singolo giorno
// - Basato su TimeRange[] (NO stringhe)
//
// SOURCE OF TRUTH:
// - configurationSetup.store (OpeningHoursFE)
//
// SUPPORTA:
// - Chiuso        → []
// - H24           → [{ 00:00 → 23:59 }]
// - Orario unico  → [{ from, to }]
// - Doppio turno  → [{ from, to }, { from, to }]
//
// ======================================================

type TimeRange = {
  from: string;
  to: string;
};

type OpeningHoursDayProps = {
  dayKey: string;
  dayLabel: string;
  value: TimeRange[];
  onChange: (value: TimeRange[]) => void;
  disabled?: boolean;
};

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MINUTES = ["00", "15", "30", "45"];

export function OpeningHoursDay({
  dayLabel,
  value,
  onChange,
  disabled = false,
}: OpeningHoursDayProps) {
  const ranges = value ?? [];

  /* ======================================================
     PRESET ACTIONS
  ====================================================== */

  function setClosed() {
    onChange([]);
  }

  function setH24() {
    onChange([{ from: "00:00", to: "23:59" }]);
  }

  function setSingle() {
    onChange([{ from: "09:00", to: "18:00" }]);
  }

  function setSplit() {
    onChange([
      { from: "09:00", to: "13:00" },
      { from: "16:00", to: "20:00" },
    ]);
  }

  /* ======================================================
     UPDATE RANGE
  ====================================================== */

  function updateRange(
    index: number,
    patch: Partial<TimeRange>
  ) {
    const next = [...ranges];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="opening-day">
      <strong>{dayLabel}</strong>

      {/* ================= PRESET ================= */}
      <div className="opening-presets">
        <button type="button" onClick={setClosed} disabled={disabled}>
          Chiuso
        </button>

        <button type="button" onClick={setH24} disabled={disabled}>
          H24
        </button>

        <button type="button" onClick={setSingle} disabled={disabled}>
          Orario unico
        </button>

        <button type="button" onClick={setSplit} disabled={disabled}>
          Doppio turno
        </button>
      </div>

      {/* ================= RANGE EDIT ================= */}
      {ranges.map((r, idx) => (
        <div key={idx} className="time-range">
          <TimeSelect
            value={r.from}
            onChange={(v) =>
              updateRange(idx, { from: v })
            }
          />
          <span> — </span>
          <TimeSelect
            value={r.to}
            onChange={(v) =>
              updateRange(idx, { to: v })
            }
          />
        </div>
      ))}
    </div>
  );
}

/* ======================================================
   SUB — TIME SELECT
====================================================== */

function TimeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [h, m] = value.split(":");

  return (
    <>
      <select
        value={h}
        onChange={(e) =>
          onChange(`${e.target.value}:${m}`)
        }
      >
        {HOURS.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>

      :

      <select
        value={m}
        onChange={(e) =>
          onChange(`${h}:${e.target.value}`)
        }
      >
        {MINUTES.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
    </>
  );
}
