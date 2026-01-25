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
// ======================================================

import { EnginePreview } from "@app/webyDevEngine/EnginePreview";
import type { EngineCanvas } from "@app/webyDevEngine/developerEngine/engine.schema.fe";
import { siteClasses as cls } from "./site.classes";

type Props = {
  canvas: EngineCanvas;
};

export default function SiteView({ canvas }: Props) {
  return (
    <div className={cls.root}>
      <EnginePreview canvas={canvas} />
    </div>
  );
}
