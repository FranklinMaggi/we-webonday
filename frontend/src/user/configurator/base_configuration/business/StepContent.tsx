import { useConfigurationSetupStore }from "@shared/domain/user/configurator/configurationSetup.store"
import { OpeningHoursDay } from "./OpeningHoursDay";


import {
  DAYS_ORDER, 
} from "@shared/domain/business/openingHours.types";
import { DAY_LABELS } from "@src/shared/domain/business/openingHours.constants";

export default function StepContent({ onNext, onBack }: any) {
  const { data, setField } = useConfigurationSetupStore();

  return (
    <div className="step">
      <h2>Contenuti del sito</h2>

      {/* … testi e visibility invariati … */}

      <h3>Orari di apertura</h3>

      { DAYS_ORDER.map((dayKey) => (
        <OpeningHoursDay
          key={dayKey}
          dayKey={dayKey}
          dayLabel={DAY_LABELS[dayKey] ?? []}
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
