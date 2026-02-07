// ======================================================
// FE || STEP DESIGN — PREVIEW ENGINE
// ======================================================

import { useConfigurationSetupStore } from "@src/user/editor/api/type/configurator/configurationSetup.store";

import { generatePreviewCanvases } from "@src/user/workspace/tools/webyDevEngine/developerEngine/engine.orchestrator";
import { EnginePreview } from "@src/user/workspace/tools/webyDevEngine/EnginePreview";

import { COLOR_PRESETS } from "@src/user/workspace/tools/webyDevEngine/configurationLayout/palette.dto";
import { LAYOUT_STYLES } from "@src/user/workspace/tools/webyDevEngine/configurationLayout/style.dto";
import type { LayoutKVDTO } from "@src/user/workspace/tools/webyDevEngine/configurationLayout/layout.dto";

import { slugify } from "@shared/utils/slugify";



type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function StepDesign({ onNext, onBack }: Props) {
  const { data } = useConfigurationSetupStore();
  const addressString =
  data.businessAddress?.street &&
  data.businessAddress?.city
    ? `${data.businessAddress.street}, ${data.businessAddress.city}`
    : "";
const configurationId = data.configurationId;

  /* =========================
     GUARD — PREREQUISITI STEP
     (OBBLIGATORIO)
  ========================= */
  if (
    !configurationId ||
    !data.businessName ||
    !data.sector ||
    !addressString
  ) {
    return (
      <div className="step-error">
        <h3>Dati mancanti</h3>
        <p>
          Completa prima lo step precedente.
        </p>
      </div>
    );
  }

  /* =========================
     PREVIEW GENERATION
  ========================= */
  const previews = generatePreviewCanvases({
    configurationId,
    business: {
      name: data.businessName,
      sector: data.sector,
      address:addressString,
      slug: slugify(data.businessName),
    },
    layouts: AVAILABLE_LAYOUTS,
    styles: LAYOUT_STYLES.map((s) => s.id),
    palettes: COLOR_PRESETS.map((p) => p.id),
  });

  return (
    <div className="step step-design">
      <h2>Scegli il layout del tuo sito</h2>

      <div className="preview-grid">
        {previews.map((canvas, i) => (
          <EnginePreview key={i} canvas={canvas} />
        ))}
      </div>

      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button onClick={onNext}>Continua</button>
      </div>
    </div>
  );
}



/**
 * TEMPORANEO (FE)
 * Domani arriva dal BE
 */
const AVAILABLE_LAYOUTS: LayoutKVDTO[] = [
  {
    id: "layout-landing-essential",
    version: "1",
    name: "Landing Essential",
    description: "Landing page singola",
    supportedStyles: ["modern", "elegant", "minimal", "bold"],
    supportedPalettes: ["warm", "dark", "light", "pastel", "corporate"],
    structure: {
      navbar: true,
      hero: true,
      sections: ["gallery", "contact", "map"],
      footer: true,
    },
    bindings: {
      businessName: true,
      logo: false,
      address: true,
      phone: true,
      services: true,
    },
    render: {
      inlineCss: false,
      previewBlur: false,
    },
  },
];
