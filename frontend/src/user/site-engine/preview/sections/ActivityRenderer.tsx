// sections/ActivityRenderer.tsx

type Props = {
    label: string;
  };
  
  export function ActivityRenderer({ label }: Props) {
    return (
      <section  id="chi-siamo"  className="activity">
        <h2>{label}</h2>
      </section>
    );
  }
  