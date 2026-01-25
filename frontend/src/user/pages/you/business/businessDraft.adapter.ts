import type { EngineInput } from "@app/webyDevEngine/developerEngine/engine.types";
import type { LayoutKVDTO } from "@app/webyDevEngine/configurationLayout/layout.dto";
import type { LayoutStyle } from "@app/webyDevEngine/configurationLayout/style.dto";
import type { ColorPaletteId } from "@app/webyDevEngine/configurationLayout/palette.dto";

import { slugify } from "@shared/utils/slugify";

type BusinessDraftBE = {
  businessName?: string;
  contact?: {
    address?: {
      street?: string;
      city?: string;
      province?: string;
    };
  };
};

export function adaptBusinessDraftBEToEngineInput(
  params: {
    configurationId: string;
    draft: BusinessDraftBE;
    layout: LayoutKVDTO;
    style?: LayoutStyle;
    palette?: ColorPaletteId;
  }
): EngineInput {
  const { configurationId, draft, layout } = params;

  const name = draft.businessName ?? "Attività";

  const address =
    draft.contact?.address
      ? `${draft.contact.address.street ?? ""} ${draft.contact.address.city ?? ""}`
      : "";

  return {
    configurationId,
    business: {
      name,
      sector: "Attività",
      address,
      slug: slugify(name),
    },
    layout,
    style: params.style ?? "modern",
    palette: params.palette ?? "light",
  };
}
