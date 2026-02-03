import { type OpeningHoursFE } from "../business/openingHours.types";


export type BusinessPreviewDTO = {
    id: string;
    publicId: string;
  
    name: string;
    sector?: string;
    address?: string;
  
    layoutId: string;
    style: string;
    palette: string;
  
    coverImageUrl: string;
    galleryImageUrls: string[];
  
    openingHours: OpeningHoursFE;
  };
  