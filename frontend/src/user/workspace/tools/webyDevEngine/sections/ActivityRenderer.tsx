// sections/ActivityRenderer.tsx

type Props = {
    label: string;
  };
  
  export function ActivityRenderer({ label }: Props) {
    return (
      <section className="activity">
        <h2>{label}</h2>
      </section>
    );
  }
  