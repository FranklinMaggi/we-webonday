// sections/LocationRenderer.tsx

type Props = {
    address: string;
    mapsUrl: string;
  };
  
  export function LocationRenderer({ address, mapsUrl }: Props) {
    return (
      <section className="location">
        <p>{address}</p>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          Apri su Google Maps
        </a>
      </section>
    );
  }
  