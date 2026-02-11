// src/user/site-engine/template/types/resolvedTemplate.ts

import type { LayoutKVDTO } from "../../engine/api/types/layout.dto";
import type { LayoutStyle } from "../../engine/api/types/style.dto";
import type { ColorPaletteId } from "../../engine/api/types/palette.dto";

export type ResolvedTemplate = {
  id: string;
  layout: LayoutKVDTO;
  style: LayoutStyle;
  palette: ColorPaletteId;
};
