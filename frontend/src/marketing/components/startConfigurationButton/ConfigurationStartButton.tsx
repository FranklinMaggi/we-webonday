// ============================================================
// FE || components/solutions/SolutionStartButton.tsx
// ============================================================

import { t } from "@shared/aiTranslateGenerator";

type Props = {
  disabled?: boolean;
  onClick: () => void;
};

export default function SolutionStartButton({
  disabled,
  onClick,
}: Props) {
  return (
    <div className="solution-start-button-wrapper">
      <button
        className="solution-start-button"
        disabled={disabled}
        onClick={onClick}
      >
        {t("solution.startConfiguration")}
      </button>
    </div>
  );
}
