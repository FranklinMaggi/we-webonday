import { useConfigurationSetupStore } from "../../../pages/user/dashboard/configurator/store/configurationSetup.store";
import { OpeningHoursDay } from "./OpeningHoursDay";

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
          value={data.openingHours?.[dayKey] ?? ""}
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
