// ============================================================
// FE || components/hero/HeroBase.tsx
// ============================================================
//
// RUOLO:
// - Hero SaaS riutilizzabile
// - Immagine subito sotto la navbar
// - Headline + messaggio marketing
//
// NOTE:
// - Nessun asset dinamico obbligatorio
// - Immagine opzionale e sicura
// ============================================================

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
    <section className="wd-hero">
      {/* ================= IMAGE ================= */}
      {image && (
        <div className="wd-hero__image">
          <img src={image} alt="" />
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="wd-hero__content">
        <h1 className="wd-hero__title">{title}</h1>

        {subtitle && (
          <p className="wd-hero__subtitle">{subtitle}</p>
        )}

        <div className="wd-hero__actions">
          <a
            href={referralUrl}
            className="wd-btn wd-btn-referral"
          >
            {referralLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
