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

import { EnginePreview } from "@src/user/site-engine/preview/view/EnginePreview";
import type { EngineCanvas } from "@src/user/site-engine/preview/api/types/engine.canvas";
import { siteClasses as cls } from "../site.classes";
import "../site-preview_legacy.css";
import { WorkspaceStyleControls } from "../../workspace/WorkspaceStyleControls";
import WhatsAppButtonClient from "../tools/whatsapp/WhatsAppButton";
type Props = {
  canvas: EngineCanvas;
  phoneNumber?: string | null;
};

export default function SiteView({ canvas ,phoneNumber}: Props) {
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
        {/* === SITE PREVIEW (COME ONLINE) === */}
        <EnginePreview canvas={canvas} />
     {/* CTA GLOBALI */}
     
     {phoneNumber && (
  <WhatsAppButtonClient phoneNumber={phoneNumber} />
)}
      
        {/* === WORKSPACE CONTROLS (NON PUBBLICO) === */}
        <WorkspaceStyleControls
          styleId={canvas.meta.styleId}
          paletteId={canvas.meta.paletteId}
        />
       

      </div>
    );
    
}


{/**type RenderIntents = {
  logo?: {
    position?: "left" | "center" | "right";
    overlap?: "none" | "half";
    shape?: "circle" | "rounded" | "square";
  };

  hero?: {
    alignment?: "left" | "center";
    emphasis?: "soft" | "strong";
  };
};*/}