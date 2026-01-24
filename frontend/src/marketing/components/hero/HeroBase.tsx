// ======================================================
// FE || components/hero/HeroBase.tsx
// ======================================================
// HERO BASE — STRUTTURA RIUTILIZZABILE
//
// AI COMMENT (STRUTTURA):
// - Incapsulamento: section → layout → blocks
// - Nessuna dipendenza dal contesto pagina
// - Pronto per layout padre
// ======================================================

import { heroBaseClasses as cls } from "./heroBase.classes";

interface HeroBaseProps {
  title: string;
  subtitle?: string;
  image?: string;
  referralLabel?: string;
}

export default function HeroBase({
  title,
  subtitle,
  image,
  referralLabel = "Invita un amico",
}: HeroBaseProps) {
  const referralUrl = "/referral"; // futuro: dinamico

  return (
    <section className={cls.heroShell}>
      <div className={cls.heroLayout}>
        {/* ================= IMAGE ================= */}
        {image && (
          <div className={cls.heroImage}>
            <img src={image} alt="" />
          </div>
        )}

        {/* ================= CONTENT ================= */}
        <div className={cls.heroContent}>
          <h1 className={cls.heroTitle}>{title}</h1>

          {subtitle && (
            <p className={cls.heroSubtitle}>{subtitle}</p>
          )}

          <div className={cls.heroActions}>
            <a
              href={referralUrl}
              className={cls.heroActionPrimary}
            >
              {referralLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
