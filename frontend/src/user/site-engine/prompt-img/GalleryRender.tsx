// ======================================================
// FE || SITE PREVIEW — GALLERY RENDERER
// ======================================================
//
// RUOLO:
// - Renderizzare la gallery immagini
// - Gestire placeholder prompt quando vuota
//
// INVARIANTI:
// - Read only
// - Nessuna fetch
// - Nessuna mutazione
// ======================================================

type Props = {
  images: string[];
  placeholder: boolean;
};

const PROMPT_GALLERY_IMAGE =
  "https://promptimg.webonday.it/default-image/gallery.png";

export function GalleryRenderer({
  images,
  placeholder,
}: Props) {
  if (images.length === 0 && placeholder) {
    return (
      <section id="gallery" className="gallery gallery--prompt">
        <img
          src={PROMPT_GALLERY_IMAGE}
          alt="Carica immagini"
        />
        <p>Carica le foto della tua attività</p>
      </section>
    );
  }

  return (
    <section className="gallery">
      {images.map((src: string, i: number) => (
        <img
          key={i}
          src={src}
          alt={`Gallery ${i}`}
        />
      ))}
    </section>
  );
}
