// ======================================================
// FE || WORKSPACE PREVIEW — SITE VIEW
// ======================================================
//
// RUOLO:
// - Renderizzare il sito come fosse pubblico
//
// INVARIANTI:
// - NO fetch
// - NO store
// - NO side effect
// - Classi CSS SEMPRE determinate
// ======================================================

import { EnginePreview } from "@src/user/site-preview/tools/webyDevEngine/EnginePreview";
import type { EngineCanvas } from "@src/user/site-preview/frontend-preview/api/types/engine.canvas";
import { siteClasses as cls } from "./site.classes";
import "./site-preview.css";

type Props = {
  canvas: EngineCanvas;
};

export default function SiteView({ canvas }: Props) {
  const styleClass = canvas.meta.styleId
    ? `style-${canvas.meta.styleId}`
    : "style-default";

  const paletteClass = canvas.meta.paletteId
    ? `palette-${canvas.meta.paletteId}`
    : "palette-default";

  return (
    <div
      className={[
        cls.root,
        styleClass,
        paletteClass,
      ].join(" ")}
    >
      <EnginePreview canvas={canvas} />
    </div>
  );
}