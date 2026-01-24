// sections/GalleryRenderer.tsx

type Props = {
    images: string[];
    placeholder: boolean;
  };
  
  export function GalleryRenderer({ images, placeholder }: Props) {
    return (
      <section className="gallery">
        {images.length === 0 && placeholder ? (
          <div className="gallery-placeholder">
            Carica le foto della tua attività
          </div>
        ) : (
          images.map((src, i) => (
            <img key={i} src={src} alt={`Gallery ${i}`} />
          ))
        )}
      </section>
    );
  }
  