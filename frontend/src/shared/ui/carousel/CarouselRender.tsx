// ======================================================
// FE || UI || CarouselRenderer
// ======================================================
//
// RUOLO:
// - Wrapper neutro per card
// - Nessuna logica
// - Nessuna selezione
// - Solo contenitore strutturale
// ======================================================

type Props = {
    children: React.ReactNode;
    className?: string;
  };
  
  export function CarouselRenderer({
    children,
    className,
  }: Props) {
    return (
      <div className={`carousel ${className ?? ""}`}>
        <div className="carousel__track">
          {children}
        </div>
      </div>
    );
  }
  