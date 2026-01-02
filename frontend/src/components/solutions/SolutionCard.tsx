// ============================================================
// FE || components/solutions/SolutionCard.tsx
// ============================================================
//
// RUOLO:
// - Card visuale di una Solution
//
// MOSTRA:
// - Immagine rappresentativa
// - Titolo
// - Descrizione breve
//
// AZIONE:
// - Click → /home/solution/:id
// ============================================================

import { useNavigate } from "react-router-dom";
import type { AdminSolution } from "../../dto/solution";

type Props = {
  solution: AdminSolution;
};

export default function SolutionCard({ solution }: Props) {
    const navigate = useNavigate();
  
    return (
      <div
        className="wd-card solution-card"
        onClick={() => navigate(`/home/solution/${solution.id}`)}
      >
        <div className="wd-card__media">
          <img
            src={(solution as any).image}
            alt={solution.name}
            loading="lazy"
          />
        </div>
  
        <div className="solution-card__content">
          <h3 className="solution-card__title">{solution.name}</h3>
          <p className="solution-card__description">
            {solution.description}
          </p>
          <span className="solution-card__cta">Scopri di più →</span>
        </div>
      </div>
    );
  }
  