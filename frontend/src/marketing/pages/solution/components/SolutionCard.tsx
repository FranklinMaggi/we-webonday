// ============================================================
// FE || components/solutions/SolutionCard.tsx
// ============================================================
//
// AI-SUPERCOMMENT
// - Card presentazionale di una Solution
// - Nessuna conoscenza di layout pagina
// - Navigazione delegata (click → route)
// ============================================================

import { useNavigate } from "react-router-dom";
//import { solutionCardClasses as cls } from "../page/catalogue/solutionCard.classes";
import {t} from "@shared/aiTranslateGenerator";
type PublicSolutionCard = {
  id: string;
  name: string;
  description: string;
  image?: string;
};

type Props = {
  solution: PublicSolutionCard;
  selected?:boolean;
  onSelect?:()=>void; 
};
import { solutionCardClasses as cls } from "./solutionCard.classes";
import { buildCard } from "@shared/ui/card-engine/buildCard";

export default function SolutionCard({ solution, selected, onSelect }: Props) {
  const navigate = useNavigate();

  const model = buildCard({
    id: solution.id,
    title: solution.name,
    description: solution.description,
    image: solution.image,
    selected,
    ctaLabel: "Scopri di più →",
    onCtaClick: () =>
      navigate(`/solution/${solution.id}`),
  });

  return (
    <article
      className={cls.card}
      data-selected={model.selected}
      data-id={model.id}
      role="button"
      tabIndex={0}
      onClick={onSelect}
    >
      {/* MEDIA FULL */}
      <div className={cls.media}>
        {model.image && (
          <img
            src={model.image}
            alt={model.title}
            className={cls.image}
            loading="lazy"
          />
        )}
  
        {/* OVERLAY */}
        <div className={cls.overlay}>
          <h3 className={cls.title}>{model.title}</h3>
  
          {model.description && (
            <p className={cls.description}>
              {model.description}
            </p>
          )}
  
          <button
            type="button"
            className={cls.button}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
          >
            {t("solution.select")}
          </button>
        </div>
      </div>
    </article>
  );
  
}
