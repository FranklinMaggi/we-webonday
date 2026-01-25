   /* AI-SUPERCOMMENT
 * RUOLO:
 * - DTO pubblico Solution lato FE
 * - SPECCHIO del DTO BE pubblico
 * - NON usa inferenze
 */

import type { OpeningHoursFE } from "@src/user/configurator/base_configuration/configuration/configurationSetup.store";

export type PublicSolutionDTO = {
    id: string;
    name: string;
    description: string; // 🔒 NON opzionale
    imageKey?: string;
    icon?: string;
    industries: string[];
  
  openingHours:OpeningHoursFE;
    
  };
  