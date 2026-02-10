// ======================================================
// FE || SITE PREVIEW — LOGO RENDERER
// ======================================================
//
// RUOLO:
// - Renderizza il logo del business
// - Mostra placeholder SOLO se logo mancante
//
// INVARIANTI:
// - Read only
// - Nessuna fetch
// - Nessuna mutazione
// ======================================================

type Props = {
  logoImage?: string;
  placeholder?: boolean;
};

const PROMPT_LOGO_IMAGE =
  "https://promptimg.webonday.it/default-image/logo.png";

export function LogoRenderer({
  logoImage,
  placeholder,
}: Props) {
  const hasLogo = Boolean(logoImage);

  if (!hasLogo && !placeholder) return null;

  return (
    <div
      className={[
        "logo",
        !hasLogo ? "logo--placeholder" : "",
      ].join(" ")}
    >
      <img
        src={logoImage ?? PROMPT_LOGO_IMAGE}
        alt="Logo attività"
      />

      {!hasLogo && (
        <span className="logo__label">
          Carica il logo
        </span>
      )}
    </div>
  );
}
