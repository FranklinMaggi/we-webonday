   /* AI-SUPERCOMMENT
 * RUOLO:
 * - DTO pubblico Solution lato FE
 * - SPECCHIO del DTO BE pubblico
 * - NON usa inferenze
 */

export type PublicSolutionDTO = {
    id: string;
    name: string;
    description: string; // 🔒 NON opzionale
    imageKey?: string;
    icon?: string;
    industries: string[];
  
    openingHoursDefault?: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
  };
  