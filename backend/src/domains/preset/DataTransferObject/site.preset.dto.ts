/**
 * ======================================================
 * DOMAIN || PRESET || PUBLIC DTO
 * ======================================================
 * RUOLO:
 * - DTO pubblico per FE
 * - SOLO dati necessari alla selezione
 * ======================================================
 */

export type SitePresetPublicDTO = {
    id: string;
    solutionId: string;
  
    name: string;
    description: string;
  
    preview: {
      heroImageKey: string;
    };
  };
  