// ======================================================
// FE || PRECONFIGURATOR || PresetSelectionPage
// ======================================================

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PresetSelector } from "./PresetSelector";

export default function PresetSelectionPage() {
  const { solutionId } = useParams<{ solutionId: string }>();
  const navigate = useNavigate();

  const [presetId, setPresetId] = useState<string | null>(null);

  if (!solutionId) {
    return <p>Solution non valida</p>;
  }

  return (
    <main className="page-section">
      <PresetSelector
        solutionId={solutionId}
        onPresetSelected={setPresetId}
      />

      {presetId && (
        <footer style={{ marginTop: 40 }}>
          <button
            type="button"
            onClick={() =>
              navigate(
                `/user/login?solution=${solutionId}&preset=${presetId}`
              )
            }
          >
            Continua
          </button>
        </footer>
      )}
    </main>
  );
}
