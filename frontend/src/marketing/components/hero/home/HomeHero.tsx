// ======================================================
// FE || components/hero/home/HomeHero.tsx
// ======================================================
// HOME HERO — MARKETING
//
// AI COMMENT:
// - Componente di composizione
// - Non gestisce layout
// - Delega struttura a HeroBase
// ======================================================

import HeroBase from "../HeroBase";
import heroImg from "./hero1.png";
import { t } from "@shared/aiTranslateGenerator";

export default function HomeHero() {
  return (
    <HeroBase
      title={t("home.hero.h1")}
      subtitle={t("home.hero.subtitle")}
      image={heroImg}
    />
  );
}
