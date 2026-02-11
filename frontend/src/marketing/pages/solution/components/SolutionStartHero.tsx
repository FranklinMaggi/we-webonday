// ============================================================
// FE || components/solutions/SolutionStartHero.tsx
// ============================================================

import { t } from "@shared/aiTranslateGenerator";

type Props = {
  businessName: string;
  onBusinessNameChange: (value: string) => void;
};

export default function SolutionStartHero({
  businessName,
  onBusinessNameChange,
}: Props) {
  return (
    <section className="solution-start-hero">
      <div className="solution-start-hero__overlay" />

      <div className="solution-start-hero__content">
        <h2 className="solution-start-hero__title">
          Il tuo sito prende forma con <span>WebOnDay</span>
        </h2>

        <p className="solution-start-hero__subtitle">
          Scegli la soluzione, inserisci il nome della tua attività.
        </p>

        <div className="solution-start-hero__form">
          <input
            className="solution-start-hero__input"
            placeholder={t("solution.businessName.placeholder")}
            value={businessName}
            onChange={(e) => onBusinessNameChange(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
