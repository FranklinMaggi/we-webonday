// sections/DescriptionRenderer.tsx

type Props = {
    text: string;
  };
  
  export function DescriptionRenderer({ text }: Props) {
    return (
      <section className="description">
        <p>{text}</p>
      </section>
    );
  }
  