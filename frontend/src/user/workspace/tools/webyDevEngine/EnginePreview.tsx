// ======================================================
// FE || DEVELOPER ENGINE — ENGINE PREVIEW
// ======================================================

import type { EngineCanvas } from "./developerEngine/engine.schema.fe";

import { NavbarRenderer } from "./sections/NavbarRenderer";
import { HeroRenderer } from "./sections/HeroRenderer";
import { GalleryRenderer } from "./sections/GalleryRenderer";
import { ActivityRenderer } from "./sections/ActivityRenderer";
import { DescriptionRenderer } from "./sections/DescriptionRenderer";
import { LocationRenderer } from "./sections/LocationRenderer";
import { FooterRenderer } from "./sections/FooterRenderer";
import { OpeningHoursRenderer } from "./sections/OpeningHourRenderer";

type Props = {
  canvas: EngineCanvas;
};

export function EnginePreview({ canvas }: Props) {
  const sections = canvas.layout.sections;

  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case "navbar":
            return <NavbarRenderer key={index} {...section} />;

          case "hero":
            return <HeroRenderer key={index} {...section} />;

          case "gallery":
            return <GalleryRenderer key={index} {...section} />;

          case "activity":
            return <ActivityRenderer key={index} {...section} />;

          case "description":
            return <DescriptionRenderer key={index} {...section} />;

          case "opening-hours":
            return (
              <OpeningHoursRenderer
                key={index}
                openingHours={section.data}
              />
            );

          case "location":
            return <LocationRenderer key={index} {...section} />;

          case "footer":
            return <FooterRenderer key={index} {...section} />;

          default:
            return null;
        }
      })}
    </>
  );
}