




import { useConfigurationSetupStore } from "../configuration/configurationSetup.store";
import { OpeningHoursDay } from "./OpeningHoursDay";
import type { OpeningHoursFE } from "../configuration/configurationSetup.store";

/**
 * TRUE se TUTTI i giorni sono vuoti
 */
export function isOpeningHoursEmpty(
  openingHours: OpeningHoursFE
): boolean {
  return Object.values(openingHours).every(
    (ranges) => ranges.length === 0
  );
}

const DAYS = [
  ["monday", "Lunedì"],
  ["tuesday", "Martedì"],
  ["wednesday", "Mercoledì"],
  ["thursday", "Giovedì"],
  ["friday", "Venerdì"],
  ["saturday", "Sabato"],
  ["sunday", "Domenica"],
] as const;

export default function StepContent({ onNext, onBack }: any) {
  const { data, setField } = useConfigurationSetupStore();

  return (
    <div className="step">
      <h2>Contenuti del sito</h2>

      {/* … testi e visibility invariati … */}

      <h3>Orari di apertura</h3>

      {DAYS.map(([dayKey, dayLabel]) => (
        <OpeningHoursDay
          key={dayKey}
          dayKey={dayKey}
          dayLabel={dayLabel}
          value={data.openingHours?.[dayKey] ?? []}
          onChange={(value) =>
            setField("openingHours", {
              ...data.openingHours,
              [dayKey]: value,
            })
          }
        />
      ))}

      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button onClick={onNext}>Continua</button>
      </div>
    </div>
  );
}
