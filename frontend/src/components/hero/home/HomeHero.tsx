import HeroBase from "../HeroBase";
import heroImg from "./hero1.png";

export default function HomeHero() {
  return (
    <HeroBase
      title="Il tuo e-commerce pronto per vendere"
      subtitle="WebOnDay crea siti professionali per PMI con e-commerce, pagamenti online e gestione ordini."
      image={heroImg}
    />
  );
}
