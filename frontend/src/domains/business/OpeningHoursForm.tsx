/* AI-SUPERCOMMENT
 * RUOLO:
 * - UI per modificare gli orari Business
 * - NON parla con fetch
 */

import { type  OpeningHours ,type  TimeRange } from "../buyflow/api/storeModels/Business.store-model";

type Props = {
  value: OpeningHours;
  onChange: (next: OpeningHours) => void;
};

export function OpeningHoursForm({ value, onChange }: Props) {
  function addRange(day: keyof OpeningHours) {
    const next: TimeRange = { from: "09:00", to: "18:00" };
    onChange({
      ...value,
      [day]: [...value[day], next],
    });
  }

  return (
    <div>
      {Object.entries(value).map(([day, ranges]) => (
        <div key={day}>
          <strong>{day}</strong>
          {ranges.map((r, i) => (
            <div key={i}>
              <input value={r.from} readOnly />
              <input value={r.to} readOnly />
            </div>
          ))}
          <button onClick={() => addRange(day as keyof OpeningHours)}>
            + fascia
          </button>
        </div>
      ))}
    </div>
  );
}
