// sections/HeroRenderer.tsx

type Props = {
    title: string;
    backgroundImage?: string;
  };
  
  export function HeroRenderer({ title, backgroundImage }: Props) {
    return (
      <section
        className="hero"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1>{title}</h1>
      </section>
    );
  }
  