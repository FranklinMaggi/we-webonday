// ======================================================
// FE || WORKSPACE PREVIEW — SITE CONTAINER
// ======================================================

import { useConfigurationSetupStore } from
  "@shared/domain/user/configurator/configurationSetup.store";

import { buildCanvas } from
  "@app/webyDevEngine/developerEngine/engine.builder";

import { adaptBusinessDraftToEngineInput } from "./site.adapter";
import SiteView from "./site.view";

import { AVAILABLE_LAYOUTS } from
  "../tools/layout_mock/layouts.mock";

import type { LayoutStyle } from
  "@app/webyDevEngine/configurationLayout/style.dto";
import type { ColorPaletteId } from
  "@app/webyDevEngine/configurationLayout/palette.dto";

export default function SiteContainer() {
  const { data } = useConfigurationSetupStore();

  if (!data.configurationId || !data.businessName || !data.sector) {
    return (
      <div className="workspace-site-empty">
        Completa i dati base del business per vedere l’anteprima.
      </div>
    );
  }

  const style = (data.style ?? "modern") as LayoutStyle;
  const palette = (data.colorPreset ?? "light") as ColorPaletteId;

  const engineInput = adaptBusinessDraftToEngineInput({
    configurationId: data.configurationId,
    business: {
      name: data.businessName,
      sector: data.sector,
      address: data.address,
      openingHours: data.openingHours,
    },
    layout: AVAILABLE_LAYOUTS[0],
    style,
    palette,
  });

  const canvas = buildCanvas(engineInput);

  return <SiteView canvas={canvas} />;
}
