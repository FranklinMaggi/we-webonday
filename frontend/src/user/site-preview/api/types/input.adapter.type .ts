import {type  OpeningHoursFE } from "@src/shared/domain/business/openingHours.types";
import { type LayoutKVDTO } from "./layout.dto";
import type { LayoutStyle } from "@src/user/site-preview/api/types/style.dto";
import type { ColorPaletteId } from "@src/user/site-preview/api/types/palette.dto";

/* =====================
   INPUT TYPES
===================== */
export type BusinessDraftPreview = {
    name: string;
    sector?: string;
    address?: string;
    openingHours?: OpeningHoursFE;
  };
  export  type AdapterInput = {
    configurationId: string;
    business: BusinessDraftPreview;
  
    layout: LayoutKVDTO;
    style: LayoutStyle;
    palette: ColorPaletteId;
  };
  