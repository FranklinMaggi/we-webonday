// ============================================================
// FE || components/solutions/SolutionsSection.tsx
// ============================================================
//
// RUOLO:
// - Sezione riutilizzabile per mostrare le Solutions
//
// FA:
// - Fetch pubblico delle solutions
// - Gestione loading / error
// - Render delle SolutionCard
//
// NON FA:
// - Routing
// - Hero
// - Layout di pagina
// ============================================================

import { useEffect, useState } from "react";

import { fetchPublicSolutions } from "../../lib/solutions/solutionsApi";
import type { AdminSolution } from "../../dto/solution";

import SolutionCard from "./SolutionCard";

export default function SolutionsSection() {
  const [solutions, setSolutions] = useState<AdminSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ===========================
     LOAD SOLUTIONS (PUBLIC)
  =========================== */
  useEffect(() => {
    let cancelled = false;

    async function loadSolutions() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPublicSolutions();
        if (!cancelled) setSolutions(data);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Errore caricamento soluzioni");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSolutions();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="catalog">
      <h2>Solutions</h2>

      {loading && <p>Caricamento soluzioni…</p>}

      {!loading && error && (
        <p className="error">{error}</p>
      )}

      {!loading && !error && solutions.length === 0 && (
        <p>Nessuna soluzione disponibile al momento.</p>
      )}

      {!loading && !error && solutions.length > 0 && (
        <div className="wd-grid">
          {solutions.map((solution) => (
            <SolutionCard
              key={solution.id}
              solution={solution}
            />
          ))}
        </div>
      )}
    </section>
  );
}
