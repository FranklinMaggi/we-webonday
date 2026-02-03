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
import { solutionCardClasses as cls } from "./solutionCard.classes";

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

export default function SolutionCard({ solution,selected, onSelect }: Props) {
  const navigate = useNavigate();

  return (
    <article
  className={cls.card}
  data-selected={selected}
  role="button"
  tabIndex={0}
  onClick={onSelect}
>
      {/* ================= MEDIA ================= */}
      <div className={cls.media}>
        {solution.image && (
          <img
            src={solution.image}
            alt={solution.name}
            loading="lazy"
            className={cls.image}
          />
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className={cls.content}>
        <h3 className={cls.title}>{solution.name}</h3>

        <p className={cls.description}>
          {solution.description}
        </p>

        <span
  className={cls.cta}
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/solution/${solution.id}`);
  }}
>
  Scopri di più →
</span>
      </div>
    </article>
  );
}
