import HeroBase from "../HeroBase";
import heroImg from "./hero1.png";

export default function HomeHero() {
  return (
    <HeroBase
      title="La tua idea diventa un sito che lavora per te."
      subtitle="WebOnDay ti permette di creare landing page, e-commerce e soluzioni SaaS partendo da modelli intelligenti, personalizzati e pronti a vendere. Tu scegli la solution. La piattaforma fa il resto."
      image={heroImg}
    />
  );
}
