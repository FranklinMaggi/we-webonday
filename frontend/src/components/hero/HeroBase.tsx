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
  const referralUrl = "/referral"; // potrai renderlo dinamico in futuro

  return (
    <section className="wd-hero">
      <div className="wd-hero__content">
        <h1 className="wd-hero__title">{title}</h1>

        {subtitle && (
          <p className="wd-hero__subtitle">{subtitle}</p>
        )}

        {/* CTA Referral */}
        <div className="wd-hero__actions">
          <a href={referralUrl} className="wd-btn wd-btn-referral">
            {referralLabel}
          </a>
        </div>
      </div>

      {image && (
        <div className="wd-hero__media">
          <img src={image} alt="" />
        </div>
      )}
    </section>
  );
}
