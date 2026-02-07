import { type LayoutKVDTO } from "./layout.dto";

/* ======================================================
   LOCAL DTO — PREVIEW DATA
====================================================== */
export type LayoutPreviewData = {
    businessName?: string;
    phone?: string;
  
    description?: string;
    services?: string;
  
    style?: string;
    colorPreset?: string;
  };
  
  export type LayoutPreviewProps = {
    layout: LayoutKVDTO;
    data: LayoutPreviewData;
  };
  