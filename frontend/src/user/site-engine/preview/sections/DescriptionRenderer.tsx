// sections/DescriptionRenderer.tsx

type Props = {
    text: string;
  };
  
  export function DescriptionRenderer({ text }: Props) {
    return (
      <section  id="description"  className="description">
        <p>{text}</p>
      </section>
    );
  }
  