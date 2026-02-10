// ======================================================
// FE || SITE PREVIEW — HERO RENDERER
// ======================================================
//
// RUOLO:
// - Renderizzare Hero del sito
// - Mostrare prompt visivo se manca l’immagine
//
// INVARIANTI:
// - Read only
// - Nessuna fetch
// - Nessuna mutazione
// ======================================================
import { LogoRenderer } from "./LogoRenderer";


type Props = {

    title: string;
    subtitle?: string;
    backgroundImage?: string;
    logoImage?: string;
    logoPlaceholder?: boolean;
  };
  
  const PROMPT_HERO_IMAGE =
    "https://promptimg.webonday.it/default-image/hero.png";
  
  export function HeroRenderer({
    title,
    subtitle,
    backgroundImage,
    logoImage,
    logoPlaceholder
  }: Props) {
    const hasImage = Boolean(backgroundImage);
  
    return (
      <section  id="home"
        className={[
          "hero",
          !hasImage ? "hero--prompt" : "",
        ].join(" ")}
        style={{
          backgroundImage: `url(${backgroundImage ?? PROMPT_HERO_IMAGE})`,
        }}
      >
<div className="hero__content">
  <div className="hero__text">
    <h1>{title}</h1>
    {subtitle && <p>{subtitle}</p>}

    {!hasImage && (
      <p className="hero__prompt">
        Carica un’immagine di copertina
      </p>
    )}
  </div>

  <LogoRenderer
    logoImage={logoImage}
    placeholder={logoPlaceholder}
  />
</div>

      </section>
    );
  }
  